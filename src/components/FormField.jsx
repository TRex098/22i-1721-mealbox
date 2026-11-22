// One labelled field. The error and hint are linked with aria-describedby.
export default function FormField({ name, label, value, onChange, onBlur, error, hint, required = false, as: Tag = 'input', children, ...rest }) {
  const id = `field-${name}`;
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ');

  return (
    <div className={error ? 'field field-invalid' : 'field'}>
      <label htmlFor={id}>
        {label}
        {required ? '' : ' (optional)'}
      </label>
      {hint && <p id={`${id}-hint`} className="hint">{hint}</p>}
      <Tag
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        {...rest}
      >
        {children}
      </Tag>
      {error && (
        <p id={`${id}-error`} className="error-text">
          <strong>Problem:</strong> {error}
        </p>
      )}
    </div>
  );
}
