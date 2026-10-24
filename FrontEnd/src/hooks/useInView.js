import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element is in viewport for scroll-reveal animations
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0 to 1)
 * @param {string} options.rootMargin - Margin around the root
 * @param {boolean} options.triggerOnce - Whether to only trigger animation once
 * @returns {[React.RefObject, boolean]}
 */
export function useInView({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true,
} = {}) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if IntersectionObserver is available
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isInView];
}
