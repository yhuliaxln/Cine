import React from 'react';

export const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  ...props
}) => {
  return (
    <div style={styles.formGroup}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          ...styles.input,
          ...(error && styles.inputError)
        }}
        {...props}
      />
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error = '',
  ...props
}) => {
  return (
    <div style={styles.formGroup}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          ...styles.select,
          ...(error && styles.inputError)
        }}
        {...props}
      >
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

export const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  rows = 4,
  error = '',
  ...props
}) => {
  return (
    <div style={styles.formGroup}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        style={{
          ...styles.textarea,
          ...(error && styles.inputError)
        }}
        {...props}
      />
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

export const DateField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error = '',
  ...props
}) => {
  return (
    <div style={styles.formGroup}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="datetime-local"
        value={value}
        onChange={onChange}
        required={required}
        style={{
          ...styles.input,
          ...(error && styles.inputError)
        }}
        {...props}
      />
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

export const CheckboxField = ({
  label,
  name,
  checked,
  onChange,
  required = false,
  error = '',
  ...props
}) => {
  return (
    <div style={styles.checkboxGroup}>
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        style={styles.checkbox}
        {...props}
      />
      {label && (
        <label htmlFor={name} style={styles.checkboxLabel}>
          {label}
        </label>
      )}
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

const styles = {
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  },
  checkbox: {
    marginRight: '8px',
    width: '18px',
    height: '18px'
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer'
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: '2px'
  },
  errorText: {
    marginTop: '4px',
    fontSize: '12px',
    color: '#ef4444'
  }
};