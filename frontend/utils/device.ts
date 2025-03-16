/**
 * Utility functions to handle device detection and responsive behavior
 */

/**
 * Detects if the current device is a mobile device
 * @returns boolean indicating if the current device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for mobile user agent patterns
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for common mobile platform indicators
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return true;
  }
  
  // Check for touch capabilities
  if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) {
    return true;
  }
  
  // Check screen width (common breakpoint for mobile devices)
  return window.innerWidth < 768;
};

/**
 * Detects if the device has touch capabilities
 */
export const hasTouch = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0;
};

/**
 * Get the current viewport dimensions
 */
export const getViewport = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}; 