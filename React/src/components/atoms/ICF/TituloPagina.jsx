export function TituloPagina({ titulo, descricao }) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="font-bold text-2xl text-icf-primary-400 uppercase tracking-tight">
                {titulo}
            </h1>
            {descricao && (
                <p className="text-icf-primary-300 text-sm">
                    {descricao}
                </p>
            )}
        </div>
    );
}