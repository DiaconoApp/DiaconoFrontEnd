import { FiSearch } from "react-icons/fi";

export function InputBuscar(props) {
    return (
        <div className="relative">
            <FiSearch className="absolute left-2 top-3.5 text-gray-400" />
            <input type="text" placeholder={props.placeholder} value={props.value} onChange={props.onChange} className="text-icf-primary-400 border border-icf-primary-200 bg-surface-50 rounded-lg h-10 p-5 pl-7 focus:outline-none focus:border-icf-primary-200 focus:border-3 w-full text-[14px]" />
        </div>
    )
}