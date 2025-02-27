import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib';

export const useShakeAnimation = (duration = 300) => {
  const [isShaking, setIsShaking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shakeClass = cn({ 'animate-shake': isShaking });

  const triggerShake = useCallback(() => {
    setIsShaking(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIsShaking(false);
      timeoutRef.current = null;
    }, duration);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { triggerShake, shakeClass };
};
