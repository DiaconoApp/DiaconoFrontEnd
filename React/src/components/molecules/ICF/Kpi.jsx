export function Kpi(imagem){
    return(
        <div className="bg-white p-4 rounded-lg flex gap-2 items-center">
            <div className="p-3 bg-icf-primary-50 rounded-sm">
                 <img src={`./calendario.svg`} alt="" className='h-5 w-5'/>     
            </div>
            <div className="flex flex-col gap-">
                <span className="text-base text-icf-primary-200 tracking-default">Total de eventos</span>
                <span className="font-semibold text-2xl text-icf-primaty-400">3</span>
            </div>
        </div>
    );
}