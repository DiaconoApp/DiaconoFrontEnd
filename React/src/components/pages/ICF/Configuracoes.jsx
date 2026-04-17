import { useState, useEffect } from "react";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { usePermission } from "../../../hooks/usePermission";
import { Edit2, Save, X } from "lucide-react";
import api from "../../../provider/api";

const CARGOS_CONFIG = [
    { cargo: "Pastor",  nivel: "Admin",       nivelCor: "bg-green-100 text-green-700",       acessos: "Total" },
    { cargo: "Diácono", nivel: "Editor",      nivelCor: "bg-blue-100 text-blue-700",         acessos: "Escalas, Membros, Eventos" },
    { cargo: "Líder",   nivel: "Moderador",   nivelCor: "bg-amber-100 text-amber-700",       acessos: "Seu ministério" },
    { cargo: "Membro",  nivel: "Visualizador",nivelCor: "bg-icf-primary-100 text-icf-primary-300", acessos: "Calendário" },
];

const NOTIFICACOES_CONFIG = [
    { key: "emailEscalas",       label: "E-mail de escalas (48h antes)",    defaultValue: true  },
    { key: "lembreteEventos",    label: "Lembrete de eventos (24h antes)",  defaultValue: true  },
    { key: "relatorioFinanceiro",label: "Relatório financeiro semanal",     defaultValue: false },
    { key: "aniversarios",       label: "Aniversários de membros",          defaultValue: true  },
];


function carregarNotificacoesSalvas() {
    try {
        const salvo = localStorage.getItem("notificacoes_prefs");
        if (salvo) return JSON.parse(salvo);
    } catch { /* silent */ }
    return Object.fromEntries(
        NOTIFICACOES_CONFIG.map(({ key, defaultValue }) => [key, defaultValue])
    );
}

export function Configuracoes() {
    const { can } = usePermission();
    const isAdmin = can("membros");

    const [dadosIgreja, setDadosIgreja] = useState({ nome: "", cnpj: "", endereco: "", telefone: "" });
    const [dadosIgrejaEdicao, setDadosIgrejaEdicao] = useState({});
    const [editandoIgreja, setEditandoIgreja] = useState(false);
    const [notificacoes, setNotificacoes] = useState(carregarNotificacoesSalvas);

    useEffect(() => {
        if (isAdmin) carregarDadosIgreja();
    }, [isAdmin]);

    const carregarDadosIgreja = async () => {
        try {
            const fkIgreja = localStorage.getItem("fkIgreja");
            if (!fkIgreja) return;
            const res = await api.get(`/igrejas/${fkIgreja}`);
            const dados = {
                nome:     res.data?.nome     || "",
                cnpj:     res.data?.cnpj     || "",
                endereco: res.data?.endereco || "",
                telefone: res.data?.telefone || "",
            };
            setDadosIgreja(dados);
            setDadosIgrejaEdicao(dados);
        } catch {
            // Endpoint não disponível — campos ficam em branco
        }
    };

    const handleIgrejaChange = (campo, valor) => {
        setDadosIgrejaEdicao((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleSalvarIgreja = async () => {
        try {
            const fkIgreja = localStorage.getItem("fkIgreja");
            if (fkIgreja) await api.put(`/igrejas/${fkIgreja}`, dadosIgrejaEdicao);
            setDadosIgreja(dadosIgrejaEdicao);
            setEditandoIgreja(false);
        } catch (err) {
            console.error("Erro ao salvar dados da igreja:", err);
        }
    };

    const handleToggleNotificacao = (key) => {
        setNotificacoes((prev) => {
            const atualizado = { ...prev, [key]: !prev[key] };
            localStorage.setItem("notificacoes_prefs", JSON.stringify(atualizado));
            return atualizado;
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader titulo="Configurações" descricao="Preferências do sistema e da igreja" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dados da Igreja — visível apenas para admins */}
                {isAdmin && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-icf-primary-400">Dados da Igreja</h3>
                            {!editandoIgreja && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setDadosIgrejaEdicao(dadosIgreja); setEditandoIgreja(true); }}
                                    className="text-icf-primary-300 hover:text-icf-primary-400"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <InputIcf
                                label="Nome da Igreja"
                                value={editandoIgreja ? dadosIgrejaEdicao.nome : dadosIgreja.nome}
                                onChange={(e) => handleIgrejaChange("nome", e.target.value)}
                                disabled={!editandoIgreja}
                                placeholder="Nome da igreja"
                            />
                            <InputIcf
                                label="CNPJ"
                                value={editandoIgreja ? dadosIgrejaEdicao.cnpj : dadosIgreja.cnpj}
                                onChange={(e) => handleIgrejaChange("cnpj", e.target.value)}
                                disabled={!editandoIgreja}
                                placeholder="00.000.000/0000-00"
                            />
                            <InputIcf
                                label="Endereço"
                                value={editandoIgreja ? dadosIgrejaEdicao.endereco : dadosIgreja.endereco}
                                onChange={(e) => handleIgrejaChange("endereco", e.target.value)}
                                disabled={!editandoIgreja}
                                placeholder="Rua, número — Bairro, Cidade/UF"
                            />
                            <InputIcf
                                label="Telefone"
                                value={editandoIgreja ? dadosIgrejaEdicao.telefone : dadosIgreja.telefone}
                                onChange={(e) => handleIgrejaChange("telefone", e.target.value)}
                                disabled={!editandoIgreja}
                                placeholder="(00) 0000-0000"
                            />
                            {editandoIgreja && (
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditandoIgreja(false)}
                                        className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50 gap-2"
                                    >
                                        <X className="w-4 h-4" /> Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleSalvarIgreja}
                                        className="bg-icf-primary-400 hover:bg-icf-primary-300 text-white gap-2"
                                    >
                                        <Save className="w-4 h-4" /> Salvar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Permissões e Cargos — visível apenas para admins */}
                {isAdmin && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold text-icf-primary-400 mb-6">Permissões e Cargos</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-icf-primary-100">
                                    <th className="text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wide pb-3 pr-4">Cargo</th>
                                    <th className="text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wide pb-3 pr-4">Nível</th>
                                    <th className="text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wide pb-3">Acessos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CARGOS_CONFIG.map((item) => (
                                    <tr key={item.cargo} className="border-b border-icf-primary-50 last:border-0">
                                        <td className="py-3 pr-4 text-icf-primary-400 font-medium">{item.cargo}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.nivelCor}`}>
                                                {item.nivel}
                                            </span>
                                        </td>
                                        <td className="py-3 text-icf-primary-300">{item.acessos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Notificações — visível para todos */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-icf-primary-400 mb-6">Notificações</h3>
                    <div className="space-y-5">
                        {NOTIFICACOES_CONFIG.map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-icf-primary-400">{label}</span>
                                <Switch
                                    checked={notificacoes[key]}
                                    onCheckedChange={() => handleToggleNotificacao(key)}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
