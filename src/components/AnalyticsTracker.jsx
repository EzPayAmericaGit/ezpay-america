import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

let sessionId = null;

export default function AnalyticsTracker() {
  const location = useLocation();
  const startTime = useRef(Date.now());
  const isAdmin = useRef(false);

  useEffect(() => {
    // Generate session ID once
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // Check if user is admin
    base44.auth.me().then(user => {
      isAdmin.current = user?.role === 'admin';
    }).catch(() => {
      isAdmin.current = false;
    });
  }, []);

  useEffect(() => {
    // Skip tracking for admins
    if (isAdmin.current) return;

    const trackPageView = async () => {
      startTime.current = Date.now();

      try {
        // Get UTM parameters
        const params = new URLSearchParams(window.location.search);
        const utmParams = {
          source: params.get('utm_source'),
          medium: params.get('utm_medium'),
          campaign: params.get('utm_campaign')
        };

        await base44.functions.invoke('trackAnalytics', {
          eventType: 'page_view',
          pagePath: location.pathname,
          pageTitle: document.title,
          referrer: document.referrer,
          utmParams,
          deviceInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform
          },
          metadata: {
            sessionId,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`
          }
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug('Analytics tracking failed:', error);
      }
    };

    trackPageView();

    // Track page duration on unmount
    return () => {
      if (isAdmin.current) return;
      
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      
      base44.functions.invoke('trackAnalytics', {
        eventType: 'page_view',
        pagePath: location.pathname,
        pageTitle: document.title,
        duration,
        metadata: { sessionId }
      }).catch(() => {});
    };
  }, [location]);

  // Track clicks
  useEffect(() => {
    if (isAdmin.current) return;

    const handleClick = (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const eventData = {
        element: target.tagName,
        text: target.textContent?.slice(0, 100),
        href: target.href
      };

      base44.functions.invoke('trackAnalytics', {
        eventType: 'click',
        pagePath: location.pathname,
        metadata: { sessionId, ...eventData }
      }).catch(() => {});
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [location]);

  return null;
}