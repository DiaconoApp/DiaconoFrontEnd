import { FiX } from "react-icons/fi";

export function TituloModal({ titulo, onClose }) {
    return (
        <div className="flex items-center justify-between">
            <span className="font-bold text-2xl">{titulo}</span>
            <button onClick={onClose} className="text-xl rounded">
                <FiX></FiX>
            </button>
        </div>
    )
}