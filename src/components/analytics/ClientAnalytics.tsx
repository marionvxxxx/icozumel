'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    posthog?: any;
    Sentry?: any;
  }
}

export function ClientAnalytics() {
  useEffect(() => {
    // Initialize PostHog Analytics
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);var n=t;if("undefined"!=typeof e)n=t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))};else n=t;return n}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      `;
      document.head.appendChild(script);

      // Initialize PostHog with environment check
      if (window.posthog) {
        window.posthog.init('phc_demo_key', {
          api_host: 'https://app.posthog.com',
          loaded: function(posthog: any) {
            // Only enable debug in development
            const isDevelopment = window.location.hostname === 'localhost' || 
                                 window.location.hostname === '127.0.0.1';
            if (isDevelopment) {
              posthog.debug();
            }
          }
        });
      }
    }

    // Initialize Sentry Error Tracking
    if (typeof window !== 'undefined') {
      const sentryScript = document.createElement('script');
      sentryScript.src = 'https://browser.sentry-cdn.com/7.118.0/bundle.tracing.min.js';
      sentryScript.onload = () => {
        if (window.Sentry) {
          window.Sentry.init({
            dsn: '', // Add your Sentry DSN here
            environment: window.location.hostname === 'localhost' ? 'development' : 'production',
            tracesSampleRate: 0.1,
          });
        }
      };
      document.head.appendChild(sentryScript);
    }
  }, []);

  return null; // This component doesn't render anything
}