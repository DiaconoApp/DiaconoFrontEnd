export function EtapasCadastro() {
  return (
    <div className="flex items-center justify-between relative">
      <div className="border border-diacono-blue-100 w-full absolute top-3 z-0"></div>
      <div className="flex flex-col items-center justify-center w-1/2 gap-2 z-10">
        <div className="bg-diacono-blue-400 w-8 h-8 text-white rounded-full flex justify-center items-center">1</div>
        <span className="text-sm text-diacono-blue-200 font-medium">Dados Básicos</span>
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 gap-2 z-10">
        <div className="bg-diacono-blue-50 border border-diacono-blue-100 w-8 h-8 text-diacono-blue-200 rounded-full flex justify-center items-center">2</div>
        <span className="text-sm text-diacono-blue-200 font-medium">Informações Complementares</span>
      </div>
    </div>
  );
}