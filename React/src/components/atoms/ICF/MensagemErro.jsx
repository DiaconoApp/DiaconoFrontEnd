export function MensagemErro({ erros = [] }) {
    if (!erros.length) return null;

    return (
        <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded p-1 mb-4">
            <ul className="list-disc list-inside space-y-1">
                {erros.map((erro, index) => (
                    <li key={index}>{erro}</li>
                ))}
            </ul>
        </div>
    );
}