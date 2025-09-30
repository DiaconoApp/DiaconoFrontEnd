export function ItemMenuTopo({imagem, href }) {
    return (
        <button href={href} className='p-2.5 rounded-full bg-surface-50 border border-icf-primary-200 opacity-80 cursor-pointer'>
           <img src={`./${imagem}.svg`} alt="" className='h-5 w-5'/>          
        </button>
    );
} 