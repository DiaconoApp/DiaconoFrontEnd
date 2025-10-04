import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from './components/Menu';
import { KpiEventos } from './components/KpiEventos';
import { FormEventos } from './components/FormEventos';
import { Login } from './components/pages/Login';
import { Cadastro1 } from './components/pages/Cadastro1';
import { Cadastro2 } from './components/pages/Cadastro2';
import { Cadastro3 } from './components/pages/Cadastro3';
import { ModalRecorrente } from './components/molecules/ModalRecorrente';

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
            <Route path='/dev' element={<ModalRecorrente/>}></Route>
          </Routes>
        </Router>
      
      {/* </div> */}
    </>
  )
}

export default App
