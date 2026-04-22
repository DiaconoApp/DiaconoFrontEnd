export function TituloPagina({ titulo, descricao }) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="font-bold text-2xl text-white uppercase tracking-tight">
                {titulo}
            </h1>
            {descricao && (
                <p className="text-slate-400 text-sm">
                    {descricao}
                </p>
            )}
        </div>
    );
}