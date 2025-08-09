import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from './supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function handleStripeWebhook(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Check for idempotency
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events')
      .select('id')
      .eq('stripe_event_id', event.id)
      .single();

    if (existingEvent) {
      console.log('Event already processed:', event.id);
      return NextResponse.json({ received: true });
    }

    // Process the event
    await processStripeEvent(event);

    // Record the event as processed
    await supabaseAdmin
      .from('webhook_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        data: event.data.object,
      });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function processStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;
    
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionChange(event.data.object as Stripe.Subscription);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
      break;
    
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
    
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;
    
    default:
      console.log('Unhandled event type:', event.type);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing successful payment:', paymentIntent.id);
  
  // Update booking status to confirmed
  const { error } = await supabaseAdmin
    .from('bookings')
    .update({ 
      status: 'CONFIRMED',
      paymentIntentId: paymentIntent.id 
    })
    .eq('paymentIntentId', paymentIntent.id);

  if (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }

  // TODO: Send confirmation notification
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing failed payment:', paymentIntent.id);
  
  // Update booking status to cancelled
  const { error } = await supabaseAdmin
    .from('bookings')
    .update({ 
      status: 'CANCELLED',
      paymentIntentId: paymentIntent.id 
    })
    .eq('paymentIntentId', paymentIntent.id);

  if (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }

  // TODO: Send failure notification
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Processing subscription change:', subscription.id);
  
  // Update business subscription status
  const customerId = subscription.customer as string;
  
  const { error } = await supabaseAdmin
    .from('businesses')
    .update({
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  console.log('Processing subscription cancellation:', subscription.id);
  
  const customerId = subscription.customer as string;
  
  const { error } = await supabaseAdmin
    .from('businesses')
    .update({
      subscription_status: 'canceled',
      subscription_id: null,
      subscription_current_period_end: null
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing successful invoice payment:', invoice.id);
  
  // Record successful payment
  const { error } = await supabaseAdmin
    .from('payments')
    .insert({
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
    });

  if (error) {
    console.error('Failed to record payment:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing failed invoice payment:', invoice.id);
  
  // Record failed payment
  const { error } = await supabaseAdmin
    .from('payments')
    .insert({
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
    });

  if (error) {
    console.error('Failed to record failed payment:', error);
  }
}

// Utility function to create idempotent Stripe operations
export async function createIdempotentPaymentIntent(
  amount: number,
  currency: string = 'mxn',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  const idempotencyKey = `${metadata.bookingId || 'payment'}-${Date.now()}`;
  
  return await stripe.paymentIntents.create(
    {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    },
    {
      idempotencyKey,
    }
  );
}

export async function createIdempotentCustomer(
  email: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Customer> {
  const idempotencyKey = `customer-${email}-${Date.now()}`;
  
  return await stripe.customers.create(
    {
      email,
      metadata,
    },
    {
      idempotencyKey,
    }
  );
}