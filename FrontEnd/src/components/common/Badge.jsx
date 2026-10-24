import React from 'react';
import './Badge.css';

/**
 * Reusable Badge component matching Reference B design specs:
 * - Pill badge design for queue status
 * - Color tokens: primary, success, accent, danger, secondary
 * - Optional pulsating live dot
 */
export function Badge({
  children,
  variant = 'primary', // 'primary' | 'success' | 'accent' | 'danger' | 'secondary' | 'neutral'
  size = 'md', // 'sm' | 'md'
  pulse = false,
  icon,
  className = ''
}) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${pulse ? 'badge-pulse' : ''} ${className}`}>
      {pulse && <span className="badge-dot" aria-hidden="true" />}
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-text">{children}</span>
    </span>
  );
}

export default Badge;
