import { FormsCadastro1 } from "../molecules/FormsCadastro1";
import { TelaAzulDiacono } from "../molecules/TelaAzulDiacono";

export function Cadastro() {
    
    return (
        // Div Global
        <div className="flex min-h-screen">
            {/* lado esquero */}
            <div className="w-1/2 flex items-center justify-center">
                <FormsCadastro1/>
            </div>


            {/* Lado direito */}
            <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
                <TelaAzulDiacono/>
            </div>
        </div>

    );
}