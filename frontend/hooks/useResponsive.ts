'use client';

import { useState, useEffect } from 'react';
import { isMobile, hasTouch, getViewport } from '@/utils/device';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState(
    typeof window !== 'undefined'
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 }
  );
  
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [hasTouchCapability, setHasTouchCapability] = useState(false);

  useEffect(() => {
    // Initial check
    setIsMobileDevice(isMobile());
    setHasTouchCapability(hasTouch());
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobileDevice(isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Check if current viewport is at or above a specific breakpoint
   */
  const isAboveBreakpoint = (breakpoint: Breakpoint): boolean => {
    return windowSize.width >= breakpoints[breakpoint];
  };

  /**
   * Check if current viewport is below a specific breakpoint
   */
  const isBelowBreakpoint = (breakpoint: Breakpoint): boolean => {
    return windowSize.width < breakpoints[breakpoint];
  };

  /**
   * Check if current viewport is within a range of breakpoints
   */
  const isWithinBreakpoints = (min: Breakpoint, max: Breakpoint): boolean => {
    return windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max];
  };

  return {
    windowSize,
    isMobile: isMobileDevice,
    hasTouch: hasTouchCapability,
    isAboveBreakpoint,
    isBelowBreakpoint,
    isWithinBreakpoints,
    breakpoints,
  };
}; 