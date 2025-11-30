import { MdOutlineModeEditOutline } from "react-icons/md";

export function LinhaMinisterio(props) {
    return (
        <li className="grid grid-cols-4 bg-icf-primary-50 text-sm text-icf-primary-400 p-4 items-center">
            <span className="flex flex-wrap">{props.nome}</span>
            <span className="flex flex-wrap">{props.lider}</span>
            <div className="rounded-2xl border border-icf-primary-100 text-icf-primary-200 w-[50%] flex items-center justify-center p-1">
                {props.status}
            </div>
            <div className="flex items-center justify-between">
                <span>{props.dataCriacao}</span>
                <MdOutlineModeEditOutline
                    className="text-icf-primary-200 hover:text-icf-primary-300 cursor-pointer"
                    size={22}
                    onClick={props.onEditar}
                />
            </div>
        </li>
    );
}
