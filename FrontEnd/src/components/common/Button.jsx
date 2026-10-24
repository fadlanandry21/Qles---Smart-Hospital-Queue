import React from 'react';
import './Button.css';

/**
 * Reusable Button component matching Reference B design specs:
 * - 10px button radius
 * - Solid primary buttons
 * - Outlined secondary buttons
 * - Smooth transition and accessible focus
 */
export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  as: Component = 'button',
  className = '',
  onClick,
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading ? 'btn-loading' : '',
    disabled ? 'btn-disabled' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={classes}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        iconLeft && <span className="btn-icon btn-icon-left">{iconLeft}</span>
      )}
      <span className="btn-label">{children}</span>
      {!loading && iconRight && (
        <span className="btn-icon btn-icon-right">{iconRight}</span>
      )}
    </Component>
  );
}

export default Button;
