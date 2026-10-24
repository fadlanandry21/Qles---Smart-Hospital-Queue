import React from 'react';
import { useInView } from '../../hooks/useInView';
import './Reveal.css';

/**
 * Scroll Animation Wrapper component:
 * - Automatically triggers smooth reveal transition when scrolled into view
 * - Direction options: 'up', 'down', 'left', 'right', 'fade'
 * - Customizable delay and duration
 */
export function Reveal({
  children,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'fade'
  delay = 0,
  duration = 600,
  threshold = 0.15,
  triggerOnce = true,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const [ref, isInView] = useInView({ threshold, triggerOnce });

  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`
  };

  return (
    <Component
      ref={ref}
      style={style}
      className={`reveal-wrapper reveal-${direction} ${isInView ? 'is-revealed' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Reveal;
