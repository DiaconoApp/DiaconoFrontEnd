export function ItemMenuLateral({ label, imagem, onClick}) {
    return (
        <a className={`flex gap-3 px-4 py-3 rounded-lg text-white/70 text-sm font-medium 
                    hover:bg-white/10 hover:text-white hover:gap-4 transition-all duration-150 ease-in-out cursor-pointer
                   ${!label ? "justify-center" : null}`} onClick={onClick}>
            <img src={`/${imagem}.svg`} alt={`icone da opção ${label}`} className="h-5 w-5 brightness-0 invert opacity-70 group-hover:opacity-100"/>
            {label && <span>{label}</span>}
        </a>
    );
} 