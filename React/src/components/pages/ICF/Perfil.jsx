import { useState, useEffect } from "react";
import { buscarPerfilLogado, atualizarMembro } from "../../../services/membros";
import { formatarCpf, formatarTelefone, formatarCargo, calcularIdade, formatarData } from "../../../utils/Utils";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    User, 
    Phone, 
    Mail, 
    Calendar, 
    MapPin, 
    Church, 
    Edit2, 
    Save, 
    X,
    Users
} from "lucide-react";
import api from "../../../provider/api";

export function Perfil() {
    const [membro, setMembro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [dadosEdicao, setDadosEdicao] = useState({});
    const [ministerios, setMinisterios] = useState([]);

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            setLoading(true);
            const dados = await buscarPerfilLogado();
            setMembro(dados);
            setDadosEdicao(dados);
            // Carregar ministérios após ter o id do membro
            if (dados?.idExterno) {
                carregarMinisterios(dados.idExterno);
            }
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
        } finally {
            setLoading(false);
        }
    };

    const carregarMinisterios = async (idMembro) => {
        try {
            const res = await api.get(`/api/v1/membro-ministerio/membro/${idMembro}`);
            setMinisterios(res.data?.content || res.data || []);
        } catch (err) {
            console.error("Erro ao carregar ministérios:", err);
        }
    };

    const handleChange = (campo, valor) => {
        setDadosEdicao((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleSalvar = async () => {
        try {
            await atualizarMembro(membro.idExterno, dadosEdicao);
            setMembro(dadosEdicao);
            setEditando(false);
            alert("Perfil atualizado com sucesso!");
        } catch (err) {
            alert("Erro ao atualizar perfil.");
            console.error(err);
        }
    };

    const handleCancelar = () => {
        setDadosEdicao(membro);
        setEditando(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-icf-primary-400"></div>
            </div>
        );
    }

    if (!membro) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-icf-primary-300">
                <User className="w-12 h-12 mb-4" />
                <p>Perfil não encontrado</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Card do Perfil */}
            <div className="bg-white rounded-xl shadow-sm">
                {/* Header do Perfil */}
                <div className="p-6 border-b border-icf-primary-50">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-icf-primary-100 flex items-center justify-center border-2 border-icf-primary-200">
                            <User className="w-8 h-8 text-icf-primary-400" />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-icf-primary-400">
                                {membro.nome}
                            </h2>
                            <p className="text-icf-primary-300">
                                {formatarCargo(membro.cargo) || "Membro"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${membro.status === "ATIVO" ? "bg-green-500" : "bg-red-500"}`}></span>
                                <span className="text-sm text-icf-primary-300">
                                    {membro.status === "ATIVO" ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="dados" className="w-full">
                    <TabsList className="w-full justify-start border-b border-icf-primary-50 rounded-none bg-transparent h-auto p-0">
                        <TabsTrigger 
                            value="dados" 
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-icf-primary-400 data-[state=active]:bg-transparent px-6 py-3"
                        >
                            Dados pessoais
                        </TabsTrigger>
                        <TabsTrigger 
                            value="ministerios"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-icf-primary-400 data-[state=active]:bg-transparent px-6 py-3"
                        >
                            Ministérios
                        </TabsTrigger>
                        <TabsTrigger 
                            value="familia"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-icf-primary-400 data-[state=active]:bg-transparent px-6 py-3"
                        >
                            Família
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab: Dados Pessoais */}
                    <TabsContent value="dados" className="p-6">
                        {editando ? (
                            // Modo de edição
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-icf-primary-400">Contato</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputIcf
                                            label="Celular"
                                            value={formatarTelefone(dadosEdicao.celular) || dadosEdicao.celular || ""}
                                            onChange={(e) => handleChange("celular", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Email"
                                            value={dadosEdicao.email || ""}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Data de Nascimento"
                                            type="date"
                                            value={dadosEdicao.dataNascimento || ""}
                                            onChange={(e) => handleChange("dataNascimento", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-icf-primary-400">Localidade</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputIcf
                                            label="CEP"
                                            value={dadosEdicao.membroEnderecoDTO?.cep || dadosEdicao.cep || ""}
                                            onChange={(e) => handleChange("cep", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Estado"
                                            value={dadosEdicao.membroEnderecoDTO?.estado || dadosEdicao.estado || ""}
                                            onChange={(e) => handleChange("estado", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Cidade"
                                            value={dadosEdicao.membroEnderecoDTO?.cidade || dadosEdicao.cidade || ""}
                                            onChange={(e) => handleChange("cidade", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Bairro"
                                            value={dadosEdicao.membroEnderecoDTO?.bairro || dadosEdicao.bairro || ""}
                                            onChange={(e) => handleChange("bairro", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Rua"
                                            value={dadosEdicao.membroEnderecoDTO?.rua || dadosEdicao.rua || ""}
                                            onChange={(e) => handleChange("rua", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Número"
                                            value={dadosEdicao.membroEnderecoDTO?.numero || dadosEdicao.numero || ""}
                                            onChange={(e) => handleChange("numero", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Complemento"
                                            value={dadosEdicao.membroEnderecoDTO?.complemento || dadosEdicao.complemento || ""}
                                            onChange={(e) => handleChange("complemento", e.target.value)}
                                            className="md:col-span-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Modo de visualização
                            <div className="space-y-6">
                                {/* Contato */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-icf-primary-400">Contato</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Celular</p>
                                            <p className="text-icf-primary-400">{formatarTelefone(membro.celular) || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Email</p>
                                            <p className="text-icf-primary-400">{membro.email || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Data de Nascimento</p>
                                            <p className="text-icf-primary-400">{formatarData(membro.dataNascimento) || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Idade</p>
                                            <p className="text-icf-primary-400">{calcularIdade(membro.dataNascimento) || "-"} anos</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Localidade */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-icf-primary-400">Localidade</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">CEP</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.cep || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Estado</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.estado || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Cidade</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.cidade || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Bairro</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.bairro || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Rua</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.rua || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Número</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.numero || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Complemento</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.complemento || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer com botões */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-icf-primary-50">
                            {editando ? (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelar}
                                        className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50 gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleSalvar}
                                        className="bg-icf-primary-400 hover:bg-icf-primary-300 text-white gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Salvar
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setEditando(true)}
                                    className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50 gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </Button>
                            )}
                            
                            <p className="text-sm text-icf-primary-300">
                                Membro desde {formatarData(membro.dataCadastro) || "-"}
                            </p>
                        </div>
                    </TabsContent>

                    {/* Tab: Ministérios */}
                    <TabsContent value="ministerios" className="p-6">
                        {ministerios.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-icf-primary-200">
                                <Church className="w-12 h-12 mb-4" />
                                <p className="text-sm">Nenhum ministério encontrado</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ministerios.map((min, index) => (
                                    <div 
                                        key={min.idExterno || index}
                                        className="flex items-center gap-4 p-4 bg-icf-primary-50 rounded-lg"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-icf-primary-200 flex items-center justify-center">
                                            <Church className="w-5 h-5 text-icf-primary-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-icf-primary-400">
                                                {min.nomeMinisterio || min.ministerio?.nome || "Ministério"}
                                            </p>
                                            <p className="text-sm text-icf-primary-300">
                                                {formatarCargo(min.funcao || min.funcaoMembro) || "Membro"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Tab: Família */}
                    <TabsContent value="familia" className="p-6">
                        <div className="py-12 flex flex-col items-center justify-center text-icf-primary-200">
                            <Users className="w-12 h-12 mb-4" />
                            <p className="text-sm">Nenhum familiar cadastrado</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
