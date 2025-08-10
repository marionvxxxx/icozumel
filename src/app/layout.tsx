@@ .. @@
 import type { Metadata } from 'next';
+import Script from 'next/script';
 import './globals.css';
 import { Providers } from '@/components/providers';
 import { AdminSidebar } from '@/components/layout/admin-sidebar';
 import { AdminHeader } from '@/components/layout/admin-header';
+import { ErrorBoundary } from '@/components/ui/error-boundary';

 export const metadata: Metadata = {
@@ .. @@
   return (
     <html lang="en">
       <body className="font-sans">
+        {/* Sentry Error Tracking */}
+        <Script
+          src="https://browser.sentry-cdn.com/7.118.0/bundle.tracing.min.js"
+          strategy="beforeInteractive"
+        />
+        <Script id="sentry-init" strategy="beforeInteractive">
+          {`
+            if (typeof Sentry !== 'undefined') {
+              Sentry.init({
+                dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
+                environment: process.env.NODE_ENV,
+                tracesSampleRate: 0.1,
+              });
+            }
+          `}
+        </Script>
+
+        {/* PostHog Analytics */}
+        <Script id="posthog-init" strategy="afterInteractive">
+          {`
+            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);var n=t;if("undefined"!=typeof e)n=t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))};else n=t;return n}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
+            posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
+              api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'}',
+              loaded: function(posthog) {
+                if (process.env.NODE_ENV === 'development') posthog.debug();
+              }
+            });
+          `}
+        </Script>
+
         <Providers>
-          <div className="flex h-screen bg-gray-50">
-            <AdminSidebar />
-            <div className="flex-1 flex flex-col overflow-hidden">
-              <AdminHeader />
-              <main className="flex-1 overflow-y-auto p-6">
-                {children}
-              </main>
+          <ErrorBoundary>
+            <div className="flex h-screen bg-gray-50">
+              <AdminSidebar />
+              <div className="flex-1 flex flex-col overflow-hidden">
+                <AdminHeader />
+                <main className="flex-1 overflow-y-auto p-6">
+                  {children}
+                </main>
+              </div>
             </div>
-          </div>
+          </ErrorBoundary>
         </Providers>
       </body>
     </html>