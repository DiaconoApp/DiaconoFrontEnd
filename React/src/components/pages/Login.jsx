import { FormsLogin} from '../molecules/FormsLogin'
import { TelaAzulDiacono } from '../molecules/TelaAzulDiacono';

export function Login() {
  
  return (
    // Div Global
    <div className="flex min-h-screen">
      {/* lado esquero */}
      <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
        <TelaAzulDiacono className={'items-start'}/>
      </div>


      {/* Lado direito */}
      <div className="w-1/2 flex items-center justify-center">
        <FormsLogin />
      </div>
    </div>
  );
}
