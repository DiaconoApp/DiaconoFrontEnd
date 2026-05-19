import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({ 
  titulo, 
  descricao, 
  acaoPrimaria,
  textoBotao,
  icone: Icone = Plus,
  disabled = false,
  children,
  centerContent
}) {
  return (
    <div className="grid grid-cols-3 items-center bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-xl text-icf-primary-400 uppercase tracking-tight">
          {titulo}
        </h1>
        {descricao && (
          <p className="text-icf-primary-300 text-sm">
            {descricao}
          </p>
        )}
      </div>
      
      <div className="flex justify-center">
        {centerContent}
      </div>
      
      <div className="flex items-center gap-3 justify-end">
        {children}
        {acaoPrimaria && textoBotao && (
          <Button
            onClick={acaoPrimaria}
            disabled={disabled}
            className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white gap-2 px-5 h-10"
          >
            <Icone className="w-4 h-4" />
            {textoBotao}
          </Button>
        )}
      </div>
    </div>
  );
}
