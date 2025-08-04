import { useState, useEffect } from 'react';

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
      
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(isTouchDevice);
      
      const isLandscape = window.innerHeight < window.innerWidth;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };

    checkMobile();
    
    const handleResize = () => checkMobile();
    const handleOrientationChange = () => {
      setTimeout(checkMobile, 100); // Delay to ensure dimensions are updated
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    isMobile,
    orientation,
    isTouch,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  };
}