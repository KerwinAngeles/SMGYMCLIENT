import { useEffect, useCallback, useState } from "react";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT = 25 * 60 * 1000; // 25 minutes
const COUNTDOWN_DURATION = 5 * 60 * 1000; // 5 minutes countdown

export const useSessionTimeout = (logout: () => void) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_DURATION / 1000);

  const resetTimeout = useCallback(() => {
    clearTimeout((window as any).sessionTimeout);
    clearTimeout((window as any).warningTimeout);
    clearInterval((window as any).countdownInterval);
    
    setShowWarning(false);
    setTimeRemaining(COUNTDOWN_DURATION / 1000);

    (window as any).warningTimeout = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(COUNTDOWN_DURATION / 1000);
      
      // Start countdown
      (window as any).countdownInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval((window as any).countdownInterval);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_TIMEOUT);

    (window as any).sessionTimeout = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  const extendSession = useCallback(() => {
    setShowWarning(false);
    clearInterval((window as any).countdownInterval);
    resetTimeout();
  }, [resetTimeout]);

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    clearInterval((window as any).countdownInterval);
    logout();
  }, [logout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    resetTimeout();

    return () => {  
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
      clearTimeout((window as any).sessionTimeout);
      clearTimeout((window as any).warningTimeout);
      clearInterval((window as any).countdownInterval);
    };
  }, [resetTimeout]);

  return {
    showWarning,
    timeRemaining,
    extendSession,
    handleLogout
  };
};