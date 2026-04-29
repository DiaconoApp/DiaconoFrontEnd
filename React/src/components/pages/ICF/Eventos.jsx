import { Outlet } from "react-router-dom";

export function Eventos() {
    return (
        <div className="flex flex-col gap-6">
            <Outlet />
        </div>
    );
}