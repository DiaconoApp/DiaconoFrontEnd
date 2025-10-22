export function TelaAzulDiacono({ className }) {
    return (
        <div className={`w-[90%] h-[90%] flex flex-col justify-between items-end ${className}`}>
            <img src="/logoDiacono.png" alt="logo da diácono" className='cursor-pointer w-[25%] opacity-90' />
            <div className={`flex flex-col items-end text-white font-light italic text-5xl ${className}`}>
                <span>Sua missão,</span>
                <span className='opacity-75'>nossa gestão:</span>
                <span className='opacity-50'>bem-vindo ao</span>
                <span className='opacity-25'>Diácono!</span>
            </div>
        </div>
    )
}