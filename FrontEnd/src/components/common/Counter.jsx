import React, { useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';
import './Counter.css';

/**
 * Animated Stat Counter component:
 * - Automatically begins count-up animation when entering viewport
 * - Formats numbers with localized digit grouping (e.g. 48.500)
 * - Supports prefix & suffix (+, %, Menit, etc.)
 */
export function Counter({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) {
  const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease-out cubic curve: 1 - pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeProgress * end;

      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, end, duration]);

  const formattedNumber = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(count);

  return (
    <span ref={ref} className={`stat-counter ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}

export default Counter;
