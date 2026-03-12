import { PageHeader } from "../../atoms/ICF/PageHeader";
import { DollarSign } from "lucide-react";

export function Financeiro() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                titulo="Financeiro"
                descricao="Gerencie as finanças da igreja"
            />

            <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-icf-primary-200">
                <DollarSign className="w-12 h-12 mb-4" />
                <p className="text-sm">Módulo em desenvolvimento</p>
            </div>
        </div>
    );
}
