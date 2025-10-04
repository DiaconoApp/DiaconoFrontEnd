export function EtapasCadastro({ className1 = "", className2 = "" }) {
  return (
    <div className="flex items-center justify-between relative">
      <div className="border border-diacono-blue-100 w-full absolute top-3 z-0"></div>
      <div className="flex flex-col items-center justify-center w-1/2 gap-2 z-10">
        <div className={`w-8 h-8 rounded-full flex justify-center items-center ${className1}`}>1</div>
        <span className="text-sm text-diacono-blue-200 font-medium">Dados Básicos</span>
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 gap-2 z-10">
        <div className={`w-8 h-8 rounded-full flex justify-center items-center ${className2}`}>2</div>
        <span className="text-sm text-diacono-blue-200 font-medium">Informações Complementares</span>
      </div>
    </div>
  );
}