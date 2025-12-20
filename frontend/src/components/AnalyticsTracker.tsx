import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ children }) => {
  const location = useLocation();
  const [visitorId, setVisitorId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    // Track visitor on first visit
    if (!visitorId) {
      trackVisitor();
    }

    // Track page view when route changes
    trackPageView(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Track page duration when component unmounts
    return () => {
      if (visitorId && sessionId) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        trackPageView(location.pathname, duration);
      }
    };
  }, [visitorId, sessionId, startTime, location.pathname]);

  const trackVisitor = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVisitorId(data.visitor_id);
        setSessionId(data.session_id);
      }
    } catch (error) {
      console.log('Analytics tracking disabled in development');
    }
  };

  const trackPageView = async (page: string, duration?: number) => {
    if (!visitorId || !sessionId) return;

    try {
      await fetch('http://localhost:8080/api/v1/analytics/pageview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          page: page,
          duration: duration || 0,
          session_id: sessionId,
        }),
      });
    } catch (error) {
      console.log('Analytics tracking disabled in development');
    }
  };

  return <>{children}</>;
};

export default AnalyticsTracker;
