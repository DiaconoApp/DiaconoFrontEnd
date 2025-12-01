import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import { CadastroProvider } from "../context/CadastroContext";
import { Login } from "../components/pages/Diacono/Login";
import { Cadastro1 } from "../components/pages/Diacono/Cadastro/Cadastro1";
import { Cadastro2 } from "../components/pages/Diacono/Cadastro/Cadastro2";
import { Cadastro3 } from "../components/pages/Diacono/Cadastro/Cadastro3";
import { Cadastro4 } from "../components/pages/Diacono/Cadastro/Cadastro4";
import { ModalVisualizarEvento } from "../components/molecules/ICF/ModalVisualizarEvento";
import { Menu } from "../components/templates/ICF/Menu";
import { ProtectedRoute } from "./ProtectedRoute";
import { Eventos } from "../components/pages/ICF/Eventos";
import { Membros } from "../components/pages/ICF/Membros";
import { Outlet } from "react-router-dom";
import { Escalas } from "../components/pages/ICF/Escalas";
import { ModalGerenciarEscala } from "../components/molecules/ICF/ModalGerenciarEscala";
import { Ministerios } from "../components/pages/ICF/Ministerios";
import { FormEventos } from "../components/molecules/ICF/FormEventos";
import { Calendario } from "../components/templates/ICF/Calendario";
import { ModalExclusaoRecorrencia } from "../components/molecules/ICF/ModalExclusaoRecorrencia";
import { ModalRecorrente } from "../components/molecules/ICF/ModalRecorrente";

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
        { path: "/dev", element: <ModalGerenciarEscala />, errorElement: <div>Error</div> },
        { path: "/login", element: <Login />, errorElement: <div>Error</div> },

        // Agrupa rotas que usam CadastroProvider
        {
            path: "/",
            element: <CadastroWrapper />,
            children: [
                { path: "cadastro/etapa1", element: <Cadastro1 /> },
                { path: "cadastro/etapa2", element: <Cadastro2 /> },
                { path: "cadastro/etapa3", element: <Cadastro3 /> },
                { path: "cadastro/etapa4", element: <Cadastro4 /> },

            ],
            errorElement: <div>Error</div>,
        },

        {
            path: "/menu",
            element: <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />,
            errorElement: <div>Error</div>,
        },
        {
            path: "/eventos",
            element: (
                <ProtectedRoute>
                    <Eventos />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Calendario />
                },
                {
                    path: "novo",
                    element: <FormEventos />
                },
                {
                    path: "editar/:idEvento",
                    element: <FormEventos />
                }
            ],
            errorElement: <div>Error</div>,
        },
        {
            path: "/escalas",
            element: (
                <ProtectedRoute>
                    <Escalas />
                </ProtectedRoute>
            ),
            errorElement: <div>Error</div>,
        },
        {
            path: "/ministerios",
            element: (
                <ProtectedRoute>
                    <Ministerios />
                </ProtectedRoute>
            ),
            errorElement: <div>Error</div>,
        },
        {
            path: "/membros",
            element: (
                <ProtectedRoute>
                    <Membros />
                </ProtectedRoute>
            ),
            errorElement: <div>Error</div>,
        },
    ]);

    return <RouterProvider router={routes} />;
}