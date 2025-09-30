import { BlocoTexto } from "./BlocoTexto";
import { BlocoLogin } from "./BlocoLogin";
import { Config } from "./Config";

export function Login() {
  return (
    // Div Global
    <div className="flex min-h-screen">
        {/* lado esquero */}
        <div className={`w-1/2 ${Config.cetralizar} bg-gradient-to-b from-blue-950 to-blue-900`}>
            <BlocoTexto textos={['Sua missão,', 'nossa gestão:', 'bem-vindo ao', 'Diácono!']} />
        </div>


        {/* Lado direito */}
        <div className={` w-1/2 ${Config.cetralizar}`}>
            <BlocoLogin />
        </div>
    </div>
  );
}
