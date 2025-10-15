import { FiX } from "react-icons/fi";

export function TituloModal(props) {
    return (
        <div className="flex items-center justify-between">
            <span className="font-bold text-2xl">{props.titulo}</span>
            <button className="text-xl hover:text-white hover:bg-icf-primary-400 rounded">
                <FiX></FiX>
            </button>
        </div>
    )
}