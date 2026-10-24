import { useState, useEffect } from 'react';

/**
 * Custom hook to detect scroll direction for hiding/revealing floating navbar
 * @param {Object} options
 * @param {number} options.threshold - Minimum scroll difference to trigger direction change
 * @param {number} options.initialDelay - Minimum scroll offset from top before hiding
 * @returns {'up' | 'down'}
 */
export function useScrollDirection({ threshold = 10, initialDelay = 80 } = {}) {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      setIsAtTop(scrollY <= initialDelay);

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY && scrollY > initialDelay ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, initialDelay]);

  return { scrollDirection, isAtTop };
}
