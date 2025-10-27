export function TituloPagina(props){
    return (
        <div className="flex flex-col">
            <span className="font-bold text-2xl text-icf-primary-400">{props.titulo}</span>
            <span className="text-icf-primary-200">{props.descricao}</span>
        </div>
    )
}