import React, { useId } from 'react';
import './FormField.css';

/**
 * Reusable FormField component:
 * - 10px input radius
 * - Accessible labels, error text, helper text
 * - Clean Qless theme borders and focus rings
 */
export function FormField({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  readOnly = false,
  as = 'input', // 'input' | 'textarea' | 'select'
  options = [], // for select: [{ value, label, disabled? }]
  iconLeft,
  iconRight,
  rows = 4,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || name || generatedId;

  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && <span className="required-star" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {iconLeft && <span className="input-icon-left">{iconLeft}</span>}

        {as === 'select' ? (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`form-input form-select ${iconLeft ? 'has-icon-left' : ''} ${iconRight ? 'has-icon-right' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : as === 'textarea' ? (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            className={`form-input form-textarea ${iconLeft ? 'has-icon-left' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined}
            {...props}
          />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            className={`form-input ${iconLeft ? 'has-icon-left' : ''} ${iconRight ? 'has-icon-right' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined}
            {...props}
          />
        )}

        {iconRight && <span className="input-icon-right">{iconRight}</span>}
      </div>

      {error ? (
        <p id={`${fieldId}-error`} className="form-error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${fieldId}-helper`} className="form-helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
