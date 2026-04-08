import { FormsCadastro3 } from "../../../molecules/Diacono/FormsCadastro3";
import { TelaAzulDiacono } from "../../../templates/Diacono/TelaAzulDiacono";

export function Cadastro4() {
    
    return (
        // Div Global
        <div className="flex min-h-screen">
            {/* lado esquero */}
            <div className="w-1/2 flex items-center justify-center">
                <FormsCadastro3/>
            </div>


            {/* Lado direito */}
            <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
                <TelaAzulDiacono/>
            </div>
        </div>

    );
}