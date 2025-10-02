import { FormsLogin } from '../atoms/FormsLogin'

export function Login() {
  return (
    // Div Global
    <div className="flex min-h-screen">
      {/* lado esquero */}
      <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
        <div className='w-[90%] h-[90%] flex flex-col justify-between'>
          <img src="./logoDiacono.png" alt="logo da diácono" className='cursor-pointer w-[25%]' />
          <div className='flex flex-col text-white font-light italic text-5xl'>
            <span>Sua missão,</span>
            <span className='opacity-75'>nossa gestão:</span>
            <span className='opacity-50'>bem-vindo</span>
            <span className='opacity-25'>Diácono!</span>
          </div>
        </div>
      </div>


      {/* Lado direito */}
      <div className="w-1/2 flex items-center justify-center">
        <FormsLogin />
      </div>
    </div>
  );
}
