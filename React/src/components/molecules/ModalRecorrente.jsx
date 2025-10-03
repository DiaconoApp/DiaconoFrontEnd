import { FiX } from "react-icons/fi";

export function ModalRecorrente() {
    return (
        <body className="bg-blue-400 flex items-center justify-center h-screen">
            <div className="border rounded w-120 h-80">
                <div className="border flex items-center justify-between p-4">
                    <span className="font-bold text-2xl">Repetir</span>
                    <button className="text-x hover:text-white hover:bg-black rounded">
                        <FiX></FiX>
                    </button>
                </div>
            </div>
        </body>
    );
}