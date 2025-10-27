import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export function ModalLocal1({ local, onClose, onSave }) {
  const [formData, setFormData] = useState({
    apelido: "",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    numero: "",
    complemento: "",
    favorito: false,
  });

  // Se tiver local (modo editar), preencher os campos
  useEffect(() => {
    if (local) {
      setFormData(local);
    }
  }, [local]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (local) {
        await axios.put(`http://localhost:3000/locais/${local.id}`, formData);
        alert("Local atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:3000/locais", {
          ...formData,
          id: crypto.randomUUID(),
        });
        alert("Local cadastrado com sucesso!");
      }

      onSave?.(); // recarrega locais no modal2
      onClose();
    } catch (error) {
      console.error("Erro ao salvar local:", error);
      alert("Erro ao salvar local.");
    }
  };
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={local ? "Editar Local" : "Novo Local"} onClose={onClose}/>
                <div className="border border-icf-primary-50"></div>
                <InputIcf name="cep" value={formData.cep} onChange={handleChange} label={"CEP"} placeholder={"Digite seu CEP"} />
                <InputIcf name="rua" value={formData.rua} onChange={handleChange}  label={"Rua/Avenida"} placeholder={"Ex: Rua Japão"} />
                <div className="flex gap-8">
                    <InputIcf name="cidade" value={formData.cidade} onChange={handleChange} label={"Cidade"} placeholder={"Digite sua cidade"} />
                    <InputIcf name="bairro" value={formData.bairro} onChange={handleChange} label={"Bairro"} placeholder={"Digite seu bairro"} />
                </div>
                <div className="flex gap-8">
                    <InputIcf  name="numero" value={formData.numero} onChange={handleChange}  label={"Número"} placeholder={"Digite o número"} />
                    <InputIcf  name="complemento" value={formData.complemento} onChange={handleChange} label={"Complemento"} placeholder={"Digite o complemento"} />
                </div>
                <InputIcf name="apelido" value={formData.apelido} onChange={handleChange} label={"Apelido do Endereço"} placeholder={"Ex: Igreja ICF"} />
                <div className="flex gap-2">
                    <input type="checkbox" className="accent-icf-primary-400" name="favorito" checked={formData.favorito} onChange={handleChange} />
                    <label className="text-icf">Favoritar Endereço</label>
                </div>
                <div className="w-full flex justify-end gap-4">
                    <div className="w-[60%] flex gap-5">
                        <BotaoIcf className="bg-icf-primary-400" onClick={handleSubmit}>{local ? "Salvar" : "Cadastrar"}</BotaoIcf>
                        <BotaoIcf className="bg-icf-primary-200" onClick={onClose}>Cancelar</BotaoIcf>
                    </div>
                </div>
            </div>
        </div>
    );
}