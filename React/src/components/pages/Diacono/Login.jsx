import { FormsLogin } from '../../molecules/Diacono/FormsLogin'
import { TelaAzulDiacono } from '../../templates/Diacono/TelaAzulDiacono';

export function Login() {

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
        <TelaAzulDiacono className={'items-start'} />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <FormsLogin />
      </div>
    </div>
  );
}
