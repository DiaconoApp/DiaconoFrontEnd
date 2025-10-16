export function Kpi({imagem, props}){
    return(
        <div className="bg-white p-4 rounded-lg flex gap-2 items-center">
            <div className="p-3 bg-icf-primary-50 rounded-sm">
                 <img src={`./calendario.svg`} alt="" className='h-5 w-5'/>     
            </div>
            <div className="flex flex-col">
                <span className="text-base text-icf-primary-200 tracking-[-0.3px]">{props.titulo}</span>
                <span className="font-semibold text-lg text-icf-primary-400">{props.valor}</span>
            </div>
        </div>
    );
}