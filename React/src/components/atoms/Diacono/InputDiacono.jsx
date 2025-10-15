export function InputDiacono({ label, type = "text", placeholder, className = "", ...props}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-diacono-blue-400">{label}</label>
      <input
        type={type}
        className={`text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-10 p-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px] ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}