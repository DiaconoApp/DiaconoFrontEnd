import { createContext, useContext, useState } from "react";

const CadastroContext = createContext();

export function CadastroProvider({ children }) {
  const [dadosCadastro, setDadosCadastro] = useState({
    fkIgreja: "",
    nome: "",
    nascimento: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    numero: "",
    complemento: "",
    uf: "",
    // outros campos...
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