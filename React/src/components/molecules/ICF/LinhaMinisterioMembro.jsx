import { MdDeleteOutline, } from "react-icons/md";

export function LinhaMinisterioMembro(props) {
    return (
        <li className="grid grid-cols-5 bg-icf-primary-50 text-sm text-icf-primary-400 p-4 items-center">
            <span className="flex flex-wrap">{props.nome}</span>
            <span className="flex flex-wrap">{props.email}</span>
            <span className="flex flex-wrap">{props.celular}</span>
            <span className="flex flex-wrap">{props.dtNascimento}</span>
            <div className="flex items-center justify-between">
            <span className="flex flex-wrap">{props.cargo}</span>

                <MdDeleteOutline
                    className="text-icf-primary-200 hover:text-icf-primary-300 cursor-pointer"
                    size={22}
                />
            </div>
        </li>
    );
}
