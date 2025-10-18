import { FiX } from "react-icons/fi";

export function TituloModal({titulo, onClick = ""}) {
    return (
        <div className="flex items-center justify-between">
            <span className="font-bold text-2xl">{titulo}</span>
            <button className="text-xl hover:text-white hover:bg-icf-primary-400 rounded">
                <FiX onClick={onClick}></FiX>
            </button>
        </div>
    )
}