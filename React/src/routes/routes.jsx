import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import { CadastroProvider } from "../context/CadastroContext";
import { Login } from "../components/pages/Diacono/Login";
import { Cadastro1 } from "../components/pages/Diacono/Cadastro/Cadastro1";
import { Cadastro2 } from "../components/pages/Diacono/Cadastro/Cadastro2";
import { Cadastro3 } from "../components/pages/Diacono/Cadastro/Cadastro3";
import { ModalVisualizarEvento } from "../components/molecules/ICF/ModalVisualizarEvento";
import { Menu } from "../components/templates/ICF/Menu";
import { ProtectedRoute } from "./ProtectedRoute";
import { Eventos } from "../components/pages/ICF/Eventos";
import { Membros } from "../components/pages/ICF/Membros";
import { Outlet } from "react-router-dom";

// Wrapper para rotas que compartilham o CadastroProvider
function CadastroWrapper() {
    return (
        <CadastroProvider>
            <Outlet />
        </CadastroProvider>
    );
}


export function AppRoutes() {
    const [menuAberto, setMenuAberto] = useState(true);

    const routes = createBrowserRouter([
        { path: "/dev", element: <ModalVisualizarEvento />, errorElement: <div>Error</div> },
        { path: "/login", element: <Login />, errorElement: <div>Error</div> },

        // Agrupa rotas que usam CadastroProvider
        {
            path: "/",
            element: <CadastroWrapper />,
            children: [
                { path: "cadastro/etapa1", element: <Cadastro1 /> },
                { path: "cadastro/etapa2", element: <Cadastro2 /> },
                { path: "cadastro/etapa3", element: <Cadastro3 /> },
                { path: "membros", element: <Membros /> },
            ],
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
        {
            path: "/eventos",
            element: <Eventos />,
            errorElement: <div>Error</div>,
        },
    ]);

    return <RouterProvider router={routes} />;
}