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
import { TituloPagina } from "../components/atoms/ICF/TituloPagina";
import { ListaMembros } from "../components/templates/ICF/ListaMembros";
import { InputBuscar } from "../components/atoms/ICF/InputBuscar";
import { SelectIcf } from "../components/atoms/ICF/SelectIcf";
import { Membros } from "../components/pages/ICF/Membros";
import {ModalCadastrar1} from "../components/molecules/ICF/ModalCadastrar1"
import {FormEventos} from "../components/molecules/ICF/FormEventos"
import {ModalRecorrente} from "../components/molecules/ICF/ModalRecorrente"

export function AppRoutes() {
    const [menuAberto, setMenuAberto] = useState(true);

    const routes = createBrowserRouter([
        { path: "/dev", element: <ModalVisualizarEvento/>, errorElement: <div>Error</div> },
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
        {
            path: "/eventos",
            element: (
                // <ProtectedRoute>
                <Eventos/>
                // </ProtectedRoute>
            ),
            errorElement: <div>Error</div>,
        },
        {
            path: "/membros",
            element: (
                // <ProtectedRoute>
                <Membros/>
                // </ProtectedRoute>
            ),
            errorElement: <div>Error</div>,
        },

        
    ]);

    return <RouterProvider router={routes} />;
}