export function BlocoTexto(props) {
    const tons = ["text-gray-50", "text-gray-300", "text-gray-400", "text-gray-500"];
    return (
        <div className="h-[90%] w-[80%] flex flex-col justify-end">
            {props.textos.map((texto, index) => (
                <span key={index} className={`italic text-5xl mb-4 text-gray font-extralight ${tons[index]}`}>{texto}</span>
            ))}
        </div>
    );
}