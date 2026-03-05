import { BaseModal } from "../../atoms/ICF/BaseModal";
import { Button } from "@/components/ui/button";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { useState, useEffect } from "react";
import axios from "axios";

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
        alert("CEP não encontrado.");
      }
    } catch (error) {
      alert("Erro ao buscar endereço pelo CEP.");
    }
  };

  return (
    <BaseModal
      title={local ? "Editar Local" : "Novo Local"}
      onClose={onClose}
      size="md"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            onClick={salvar}
            className="flex-1 bg-icf-primary-400 hover:bg-icf-primary-500 text-white"
          >
            Salvar
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
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
        <div className="flex gap-4">
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
        <div className="flex gap-4">
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
      </div>
    </BaseModal>
  );
}