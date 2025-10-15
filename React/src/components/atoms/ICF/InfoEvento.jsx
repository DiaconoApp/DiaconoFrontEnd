export function InfoEvento(props) {
    return (
        <div className="flex flex-col">
            <span className="text-icf-primary-400">{props.label}</span>
            <span className="text-icf-primary-200">{props.info}</span>
        </div>
    )
}