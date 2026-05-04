import { ListaMinisterios } from "../../templates/ICF/ListaMinisterios";
import { ListaMinisterioMembro } from "../../templates/ICF/ListaMinisterioMembro";
import { ListaMinisterioLider } from "../../templates/ICF/ListaMinisterioLider";

export function Ministerios() {
    let cargo = localStorage.getItem("cargo");

    const renderContent = () => {
        switch (cargo) {
            case "GOVERNO":
                return <ListaMinisterios />;
            case "LIDER_MINISTERIO":
                return <ListaMinisterioLider />;
            default:
                return <ListaMinisterioMembro />;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {renderContent()}
        </div>
    );
}