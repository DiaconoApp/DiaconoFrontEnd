export function InputIcf({
  label,
  type = "text",
  placeholder,
  className = "",
  value,
  onChange,
  onBlur,
  name,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-icf-primary-400"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full text-sm text-icf-primary-400 placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors disabled:bg-icf-primary-50 disabled:text-icf-primary-300 disabled:cursor-not-allowed ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
