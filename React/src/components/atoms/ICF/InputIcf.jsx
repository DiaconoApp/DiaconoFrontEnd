export function InputIcf({ label, type = "text", placeholder, className = "", ...props}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-icf-primary-400 text-[16px]">{label}</label>
      <input
        type={type}
        className={`text-icf-primary-400 border border-icf-primary-200 bg-surface-50 rounded-lg h-10 p-5 focus:outline-none focus:border-icf-primary-200 focus:border-3 text-[14px] ${className}`}
        placeholder={placeholder}
        {...props}
      />    
    </div> 
  );
}