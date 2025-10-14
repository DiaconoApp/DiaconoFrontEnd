import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import { Login } from "./components/pages/Diacono/Login";
import { Cadastro1 } from "./components/pages/Diacono/Cadastro1";
import { Cadastro2 } from "./components/pages/Diacono/Cadastro2";
import { Cadastro3 } from "./components/pages/Diacono/Cadastro3";
import { ModalVisualizarEvento } from "./components/molecules/ICF/ModalVisualizarEvento";
import { Menu } from "./components/Menu";

export function AppRoutes() {
    const [menuAberto, setMenuAberto] = useState(true);

    const routes = createBrowserRouter([
        { path: "/login", element: <Login />, errorElement: <div>Error</div> },
        { path: "/cadastro1", element: <Cadastro1 />, errorElement: <div>Error</div> },
        { path: "/cadastro2", element: <Cadastro2 />, errorElement: <div>Error</div> },
        { path: "/cadastro3", element: <Cadastro3 />, errorElement: <div>Error</div> },
        {
            path: "/menu", element: <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />,
            errorElement: <div>Error</div>,
        },
        { path: "/dev", element: <ModalVisualizarEvento />, errorElement: <div>Error</div> },
    ]);

    return <RouterProvider router={routes} />;
}