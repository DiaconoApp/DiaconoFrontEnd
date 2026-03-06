import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { useState, useEffect } from "react";
import axios from "axios";
import { AlertModal } from "../../ui/AlertModal";

export function ModalLocal1({ onClose, onSalvarEndereco, local }) {
  const [formData, setFormData] = useState({
    idExterno: null,
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    complemento: "",
    numero: "",
    apelido: "",
  });
  const [modal, setModal] = useState(null);

  function salvar() {
    onSalvarEndereco(formData);
    onClose();
  }

  // Se tiver local (modo editar), preencher os campos
  useEffect(() => {
    if (local) {
      setFormData(local);
    } else {
      setFormData({
        idExterno: null,
        cep: "",
        estado: "",
        cidade: "",
        bairro: "",
        rua: "",
        complemento: "",
        numero: "",
        apelido: "",
      });
    }
  }, [local]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Se o campo alterado for o CEP e tiver 8 dígitos, buscar endereço
    if (name === "cep" && value.length === 8) {
      buscarEnderecoPorCep(value);
    }
  };

  const buscarEnderecoPorCep = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.data.erro) {
        setFormData((prev) => ({
          ...prev,
          rua: response.data.logradouro,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          estado: response.data.uf,
        }));
      } else {
        setModal({
          type: "error",
          title: "CEP não encontrado",
          message: "CEP não encontrado."
        });
      }
    } catch (error) {
      setModal({
        type: "error",
        title: "Erro",
        message: "Erro ao buscar endereço pelo CEP."
      });
    }
  };

  return (
    <>
    <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
      <div className="w-[90%] flex flex-col gap-4">
        <TituloModal titulo={local ? "Editar Local" : "Novo Local"} onClose={onClose}/>
        <div className="border border-icf-primary-50"></div>
        
        <InputIcf 
          name="cep" 
          value={formData.cep} 
          onChange={handleChange} 
          label={"CEP"} 
          placeholder={"Digite seu CEP"} 
        />
        <InputIcf 
          name="rua" 
          value={formData.rua} 
          onChange={handleChange}  
          label={"Rua/Avenida"} 
          placeholder={"Ex: Rua Japão"} 
          disabled={!!formData.rua}
        />
        <div className="flex gap-8">
          <InputIcf 
            name="cidade" 
            value={formData.cidade} 
            onChange={handleChange} 
            label={"Cidade"} 
            placeholder={"Digite sua cidade"} 
            disabled={!!formData.cidade}
          />
          <InputIcf 
            name="bairro" 
            value={formData.bairro} 
            onChange={handleChange} 
            label={"Bairro"} 
            placeholder={"Digite seu bairro"} 
            disabled={!!formData.bairro}
          />
        </div>
        <div className="flex gap-8">
          <InputIcf  
            name="numero" 
            value={formData.numero} 
            onChange={handleChange}  
            label={"Número"} 
            placeholder={"Digite o número"} 
          />
          <InputIcf  
            name="complemento" 
            value={formData.complemento} 
            onChange={handleChange} 
            label={"Complemento"} 
            placeholder={"Digite o complemento"} 
          />
        </div>
        <InputIcf 
          name="apelido" 
          value={formData.apelido} 
          onChange={handleChange} 
          label={"Apelido do Endereço"} 
          placeholder={"Ex: Igreja ICF"} 
        />
        
        <div className="w-full flex justify-end gap-4">
          <div className="w-[60%] flex gap-5">
            <BotaoIcf className="bg-icf-primary-400" onClick={salvar}>Salvar</BotaoIcf>
            <BotaoIcf className="bg-icf-primary-200" onClick={onClose}>Cancelar</BotaoIcf>
          </div>
        </div>
      </div>
    </div>
    {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
    </>
  );
}