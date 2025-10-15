import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import { CadastroProvider } from "./context/CadastroContext";
import { Login } from "./components/pages/Diacono/Login";
import { Cadastro1 } from "./components/pages/Diacono/Cadastro/Cadastro1";
import { Cadastro2 } from "./components/pages/Diacono/Cadastro/Cadastro2";
import { Cadastro3 } from "./components/pages/Diacono/Cadastro/Cadastro3";
import { ModalVisualizarEvento } from "./components/molecules/ICF/ModalVisualizarEvento";
import { Menu } from "./components/templates/ICF/Menu";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
    const [menuAberto, setMenuAberto] = useState(true);

    const routes = createBrowserRouter([
        { path: "/login", element: <Login />, errorElement: <div>Error</div> },
        {
            path: "/cadastro1",
            element: (
                <CadastroProvider>
                    <Cadastro1 />
                </CadastroProvider>
            ),
            errorElement: <div>Error</div>,
        },
        {
            path: "/cadastro2",
            element: (
                <CadastroProvider>
                    <Cadastro2 />
                </CadastroProvider>
            ),
            errorElement: <div>Error</div>,
        },
        {
            path: "/cadastro3",
            element: (
                <CadastroProvider>
                    <Cadastro3 />
                </CadastroProvider>
            ),
            errorElement: <div>Error</div>,
        },

        {
            path: "/menu",
            element: (
                <ProtectedRoute>
                    <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
                </ProtectedRoute>
            ),
            errorElement: <div>Error</div>,
        },
        { path: "/dev", element: <ModalVisualizarEvento />, errorElement: <div>Error</div> },
    ]);

    return <RouterProvider router={routes} />;
}