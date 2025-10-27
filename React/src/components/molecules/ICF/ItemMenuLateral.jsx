export function ItemMenuLateral({ label, imagem, onClick}) {
    return (
        <a href={href} 
        className={`flex gap-3 px-4 py-3 rounded-lg text-icf-primary-300 text-sm font-medium 
                    hover:bg-icf-primary-100 hover:text-icf-primary-400 hover:gap-4 transition-all duration-350 ease-in-out 
                   ${!label ? "justify-center" : null}`}>
            <img src={`/public/${imagem}.svg`} alt={`icone da opção ${label}`} className="h-5 w-5 fill-current hover:fill-current"/>
            {label && <span>{label}</span>}
        </a>
    );
} 