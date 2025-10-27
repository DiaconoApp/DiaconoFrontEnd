import { FormsCadastro2 } from "../../../molecules/Diacono/FormsCadastro2";
import { TelaAzulDiacono } from "../../../templates/Diacono/TelaAzulDiacono";

export function Cadastro2() {
    
    return (
        // Div Global
        <div className="flex min-h-screen">
            {/* lado esquero */}
            <div className="w-1/2 flex items-center justify-center">
                <FormsCadastro2/>
            </div>
            

            {/* Lado direito */}
            <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
                <TelaAzulDiacono/>
            </div>
        </div>

    );
}