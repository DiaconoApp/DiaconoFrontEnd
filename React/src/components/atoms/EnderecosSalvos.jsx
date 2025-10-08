import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

export function EnderecosSalvos(props) {
    return (
        <div className="flex items-center gap-2 cursor-pointer rounded border border-icf-primary-200 p-5 bg-surface-50 hover:bg-icf-primary-50">
            <FaMapMarkerAlt size={18} style={{ fill: 'none', strokeWidth: 10 }} />
            <div className="flex flex-col w-[80%]">
                <label className="font-medium text-icf-primary-300 cursor-pointer">{props.titulo}</label>
                <label className="font-medium text-icf-primary-200 text-xs cursor-pointer">{props.endereco}</label>
            </div>
            <div className="flex items-center gap-1">
                <MdOutlineModeEditOutline className="text-icf-primary-200 hover:text-icf-primary-300 cursor-pointer" size={22} />
                <FaRegTrashAlt className="text-icf-primary-200 hover:text-icf-primary-300 cursor-pointer" size={18} />
            </div>
        </div>
    )
}