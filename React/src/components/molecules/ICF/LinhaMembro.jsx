import { MdOutlineModeEditOutline } from "react-icons/md";

export function LiinhaMembro(props) {
    return (
        <li className="grid grid-cols-7 bg-icf-primary-50 text-sm text-icf-primary-400 p-4 justify-between items-center">
            <span className="flex flex-wrap">{props.nome}</span>
            <span className="flex flex-wrap">{props.email}</span>
            <span>{props.celular}</span>
            <span>{props.nascimento}</span>
            <div className="flex cursor-pointer gap-1 text-xs">
                <button className="text-icf-primary-400 bg-[#D9D9D9] rounded-2xl p-1 font-medium">{props.ministério}</button>
                <button className="rounded-full border border-icf-primary-100 text-icf-primary-200 p-1">+{props.qtdMinistério}</button>
            </div>
            <div className="rounded-2xl border border-icf-primary-100 text-icf-primary-200 w-[30%] flex items-center justify-center p-1">{props.status}</div>
            <MdOutlineModeEditOutline key={props.idMembro} className="text-icf-primary-200 hover:text-icf-primary-300 cursor-pointer" size={25} />
        </li>
    )
}