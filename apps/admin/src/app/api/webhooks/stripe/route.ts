import { handleStripeWebhook } from '@/lib/stripe-webhook-handler';

export async function POST(request: Request) {
  return handleStripeWebhook(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
    },
  });
}