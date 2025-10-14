import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from './components/Menu';
import { KpiEventos } from './components/KpiEventos';
import { FormEventos } from './components/FormEventos';
import { Login } from './components/pages/Diacono/Login';
import { Cadastro1 } from './components/pages/Diacono/Cadastro1';
import { Cadastro2 } from './components/pages/Diacono/Cadastro2';
import { Cadastro3 } from './components/pages/Diacono/Cadastro3';
import { ModalRecorrente } from './components/molecules/ICF/ModalRecorrente';
import { ModalExclusao } from './components/molecules/ICF/ModalExclusao';
import { ModalLocal1 } from './components/molecules/ICF/ModalLocal1';
import { ModalLocal2 } from './components/molecules/ICF/ModalLocal2';
import { ModalCadastrar1 } from './components/molecules/ICF/ModalCadastrar1';
import { ModalCadastrar2 } from './components/molecules/ICF/ModalCadastrar2';
import { ModalExclusaoRecorrencia } from './components/molecules/ICF/ModalExclusaoRecorrencia';
import { ModalVisualizarEvento } from './components/molecules/ICF/ModalVisualizarEvento';

function App() {

  const [menuAberto, setMenuAberto] = useState(true);

  return (
    <>
      {/* <div className='bg-[#F6F7F9] flex h-full w-full'>
      <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
      <div className={`grid grid-cols-3 gap-5 w-full mt-15 p-6 transition-all duration-300
      ${menuAberto ? "ml-70" : "ml-24.5"}`}>
      <KpiEventos 
        imagem="calendario" className="flex-1"
      />
      <KpiEventos 
        imagem="calendario" className="flex-1"
      />
      <KpiEventos 
        imagem="calendario" className="flex-1"
      />
      </div> */}
      {/* <FormEventos/> */}
        <Router>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/menu" element={<Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />}/>
            <Route path="/cadastro1" element={<Cadastro1/>}></Route>
            <Route path="/cadastro2" element={<Cadastro2/>}></Route>
            <Route path="/cadastro3" element={<Cadastro3/>}></Route>
            <Route path='/dev' element={<ModalVisualizarEvento/>}></Route>
          </Routes>
        </Router>
      
      {/* </div> */}
    </>
  )
}

export default App
