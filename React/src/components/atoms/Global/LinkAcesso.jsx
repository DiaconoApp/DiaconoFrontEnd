export function LinkAcesso({ label, link, onClick }) {
  return (
    <div className="flex w-full justify-center gap-1">
      <span className="text-diacono-blue-200">{label}</span>
      <span className="text-secondary-200 cursor-pointer" onClick={onClick}>{link}</span>
    </div>
  );
}