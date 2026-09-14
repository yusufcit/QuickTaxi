/**
 * Google Analytics event tracking utilities
 * Use these functions to track custom events in your application
 */

export interface GTagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (eventData: GTagEvent) => {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (!gtag) {
    console.warn("Google Analytics not initialized");
    return;
  }

  gtag("event", eventData.action, {
    event_category: eventData.category,
    event_label: eventData.label,
    value: eventData.value,
  });
};

/**
 * Track page view
 */
export const trackPageView = (pagePath: string, pageTitle: string) => {
  trackEvent({
    action: "page_view",
    label: pageTitle,
  });
};

/**
 * Track booking submission
 */
export const trackBooking = (bookingData: {
  pickupLocation?: string;
  dropoffLocation?: string;
  bookingType?: string;
}) => {
  trackEvent({
    action: "booking_submitted",
    category: "engagement",
    label: `${bookingData.bookingType || "taxi"} - ${bookingData.pickupLocation || "unknown"}`,
    value: 1,
  });
};

/**
 * Track CTA clicks
 */
export const trackCTAClick = (ctaName: string) => {
  trackEvent({
    action: "cta_click",
    category: "engagement",
    label: ctaName,
    value: 1,
  });
};

/**
 * Track form interactions
 */
export const trackFormInteraction = (formName: string, fieldName: string) => {
  trackEvent({
    action: "form_interaction",
    category: "engagement",
    label: `${formName} - ${fieldName}`,
  });
};

/**
 * Track error events
 */
export const trackError = (errorMessage: string, errorType?: string) => {
  trackEvent({
    action: "error",
    category: "system",
    label: errorType ? `${errorType}: ${errorMessage}` : errorMessage,
  });
};
