import React from 'react';
import './Card.css';

/**
 * Reusable Card component matching Reference B design specs:
 * - 12px card radius
 * - Soft shadows
 * - Clean surface & border
 */
export function Card({
  children,
  interactive = false,
  elevated = false,
  className = '',
  onClick,
  ...props
}) {
  const classes = [
    'card',
    interactive ? 'card-interactive' : '',
    elevated ? 'card-elevated' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onClick={interactive ? onClick : undefined}
      role={interactive && onClick ? 'button' : undefined}
      tabIndex={interactive && onClick ? 0 : undefined}
      onKeyDown={
        interactive && onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
