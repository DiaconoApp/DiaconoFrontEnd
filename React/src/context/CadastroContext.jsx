import { createContext, useContext, useState } from "react";

const CadastroContext = createContext();

export function CadastroProvider({ children }) {
  const [dadosCadastro, setDadosCadastro] = useState({
    fkIgreja: "",
    nome: "",
    nascimento: "",
    cpf: "",
    email: "",
    celular: "",
    senha: "",
    confirmarSenha: "",
    cargo: "MEMBRO",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    numero: "",
    complemento: "",
  });

  return (
    <CadastroContext.Provider value={{ dadosCadastro, setDadosCadastro }}>
      {children}
    </CadastroContext.Provider>
  );
}

export function useCadastro() {
  return useContext(CadastroContext);
}