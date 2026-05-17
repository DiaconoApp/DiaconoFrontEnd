import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { CadastroProvider } from "../context/CadastroContext";
import { Login } from "../components/pages/Diacono/Login";
import { Cadastro1 } from "../components/pages/Diacono/Cadastro/Cadastro1";
import { Cadastro2 } from "../components/pages/Diacono/Cadastro/Cadastro2";
import { Cadastro3 } from "../components/pages/Diacono/Cadastro/Cadastro3";
import { Cadastro4 } from "../components/pages/Diacono/Cadastro/Cadastro4";
import { Menu } from "../components/templates/ICF/Menu";
import { ProtectedRoute } from "./ProtectedRoute";
import { Eventos } from "../components/pages/ICF/Eventos";
import { Membros } from "../components/pages/ICF/Membros";
import { Outlet } from "react-router-dom";
import { Escalas } from "../components/pages/ICF/Escalas";
import { Ministerios } from "../components/pages/ICF/Ministerios";
import { FormEventos } from "../components/molecules/ICF/FormEventos";
import { Calendario } from "../components/templates/ICF/Calendario";
import { Dashboard } from "../components/pages/ICF/Dashboard";
import { Perfil } from "../components/pages/ICF/Perfil";
import { LandingPage } from "../components/pages/Diacono/LandingPage";
import { GoogleCallback } from "../components/pages/Auth/GoogleCallback";

// Wrapper para rotas que compartilham o CadastroProvider
function CadastroWrapper() {
    return (
        <CadastroProvider>
            <Outlet />
        </CadastroProvider>
    );
}


export function AppRoutes() {
    const routes = createBrowserRouter([
        { path: "/home", element: <LandingPage />, errorElement: <div>Error</div> },
        { path: "/", element: <Navigate to="/home" />, errorElement: <div>Error</div> },
        { path: "/login", element: <Login />, errorElement: <div>Error</div> },
        { path: "/auth/google/callback", element: <GoogleCallback />, errorElement: <div>Error</div> },

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

        // Layout principal com Menu
        {
            path: "/",
            element: <Menu />,
            errorElement: <div>Error</div>,
            children: [
                {
                    path: "eventos",
                    element: (
                        <ProtectedRoute required={"eventos"}>
                            <Eventos />
                        </ProtectedRoute>
                    ),
                    children: [
                        {
                            index: true,
                            element: (
                                <ProtectedRoute required={"calendario"}>
                                    <Calendario />
                                </ProtectedRoute>
                            )
                        },
                        {
                            path: "novo",
                            element: (
                                <ProtectedRoute required={"criar_evento"}>
                                    <FormEventos />
                                </ProtectedRoute>
                            )
                        },
                        {
                            path: "editar/:idEvento",
                            element: (
                                <ProtectedRoute required={"editar_evento"}>
                                    <FormEventos />
                                </ProtectedRoute>
                            )
                        }
                    ],
                },
                {
                    path: "escalas",
                    element: (
                        <ProtectedRoute required={"escalas"}>
                            <Escalas />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "ministerios",
                    element: (
                        <ProtectedRoute required={"ministerios"}>
                            <Ministerios />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "membros",
                    element: (
                        <ProtectedRoute required={"membros"}>
                            <Membros />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "dashboard",
                    element: (
                        <ProtectedRoute required={"dashboards"}>
                            <Dashboard />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "perfil",
                    element: <Perfil />,
                },
            ],
        },

        {
            path: "/unauthorized",
            element: (
                <h1>Acesso negado</h1>
            ),
            errorElement: <div>Error</div>,
        },
    ]);

    return <RouterProvider router={routes} />;
}
