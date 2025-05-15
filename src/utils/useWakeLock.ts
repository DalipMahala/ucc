'use client';

import { useEffect } from 'react';

export function useWakeLock() {
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    
    const requestWakeLock = async () => {
      try {
        // Check if Wake Lock API is supported
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock?.request('screen');
          console.log('Screen Wake Lock active');
        }
      } catch (err) {
        console.error('Failed to activate wake lock:', err);
      }
    };

    // Request wake lock when component mounts
    requestWakeLock();

    // Release wake lock when component unmounts
    return () => {
      if (wakeLock) {
        wakeLock.release().then(() => {
          wakeLock = null;
          console.log('Screen Wake Lock released');
        });
      }
    };
  }, []);
}
