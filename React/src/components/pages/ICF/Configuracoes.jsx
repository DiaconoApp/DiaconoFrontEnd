import { useState } from "react";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const dadosIgrejaInicial = {
    nome: "Igreja Cristã da Família – ICF Núcleo",
    cnpj: "12.345.678/0001-99",
    endereco: "Rua das Acácias, 250 — Pinheiros, São Paulo/SP",
    telefone: "(11) 3456-7890",
};

const permissoesCargos = [
    {
        cargo: "Pastor",
        nivel: "Admin",
        acessos: "Total",
    },
    {
        cargo: "Governo",
        nivel: "Editor",
        acessos: "Escalas, Membros, Eventos",
    },
    {
        cargo: "Líder",
        nivel: "Moderador",
        acessos: "Seu ministério",
    },
    {
        cargo: "Membro",
        nivel: "Visualizador",
        acessos: "Calendário",
    },
];

const notificacoesInicial = [
    {
        id: "escalas",
        label: "E-mail de escalas",
        descricao: "[Até 48h antes]",
        ativo: true,
    },
    {
        id: "eventos",
        label: "Lembrete de eventos",
        descricao: "[5h antes]",
        ativo: true,
    },
    {
        id: "aniversarios",
        label: "Aniversários de membros",
        ativo: true,
    },
];

export function Configuracoes() {
    const [dadosIgreja, setDadosIgreja] = useState(dadosIgrejaInicial);
    const [notificacoes, setNotificacoes] = useState(notificacoesInicial);
    const [editando, setEditando] = useState(false);

    const handleEditarClique = () => {
        setEditando(!editando);
    };

    const handleNotificacaoToggle = (id) => {
        setNotificacoes(notificacoes.map(notif =>
            notif.id === id ? { ...notif, ativo: !notif.ativo } : notif
        ));
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader titulo="Configurações" descricao="Preferências do sistema e da igreja" />

            {/* Dados da Igreja */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-base font-semibold text-icf-primary-400 mb-3">Dados da Igreja</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-icf-primary-400 mb-1.5">Nome da Igreja</label>
                        <input
                            type="text"
                            value={dadosIgreja.nome}
                            onChange={(e) => setDadosIgreja({ ...dadosIgreja, nome: e.target.value })}
                            disabled={!editando}
                            className="w-full h-10 px-4 text-sm border border-icf-primary-100 rounded-lg bg-surface-50 text-icf-primary-400 placeholder:text-icf-primary-200 focus:outline-none focus:border-icf-primary-300 transition-colors disabled:bg-icf-primary-50 disabled:text-icf-primary-300 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-icf-primary-400 mb-1.5">CNPJ</label>
                        <input
                            type="text"
                            value={dadosIgreja.cnpj}
                            onChange={(e) => setDadosIgreja({ ...dadosIgreja, cnpj: e.target.value })}
                            disabled={!editando}
                            className="w-full h-10 px-4 text-sm border border-icf-primary-100 rounded-lg bg-surface-50 text-icf-primary-400 placeholder:text-icf-primary-200 focus:outline-none focus:border-icf-primary-300 transition-colors disabled:bg-icf-primary-50 disabled:text-icf-primary-300 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-icf-primary-400 mb-1.5">Endereço</label>
                        <input
                            type="text"
                            value={dadosIgreja.endereco}
                            onChange={(e) => setDadosIgreja({ ...dadosIgreja, endereco: e.target.value })}
                            disabled={!editando}
                            className="w-full h-10 px-4 text-sm border border-icf-primary-100 rounded-lg bg-surface-50 text-icf-primary-400 placeholder:text-icf-primary-200 focus:outline-none focus:border-icf-primary-300 transition-colors disabled:bg-icf-primary-50 disabled:text-icf-primary-300 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-icf-primary-400 mb-1.5">Telefone</label>
                        <input
                            type="text"
                            value={dadosIgreja.telefone}
                            onChange={(e) => setDadosIgreja({ ...dadosIgreja, telefone: e.target.value })}
                            disabled={!editando}
                            className="w-full h-10 px-4 text-sm border border-icf-primary-100 rounded-lg bg-surface-50 text-icf-primary-400 placeholder:text-icf-primary-200 focus:outline-none focus:border-icf-primary-300 transition-colors disabled:bg-icf-primary-50 disabled:text-icf-primary-300 disabled:cursor-not-allowed"
                        />
                    </div>
                    <Button
                        onClick={handleEditarClique}
                        className="bg-icf-primary-400 hover:bg-icf-primary-300 text-white font-medium h-10 px-4 rounded-lg w-fit text-sm"
                    >
                        {editando ? "Salvar" : "Editar"}
                    </Button>
                </div>
            </div>

            {/* Permissões e Cargos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-base font-semibold text-icf-primary-400 mb-3">Permissões e Cargos</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-icf-primary-100">
                                <th className="px-4 py-3 text-left font-semibold text-icf-primary-400">CARGO</th>
                                <th className="px-4 py-3 text-left font-semibold text-icf-primary-400">NÍVEL</th>
                                <th className="px-4 py-3 text-left font-semibold text-icf-primary-400">ACESSOS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissoesCargos.map((row, idx) => (
                                <tr key={idx} className="border-b border-icf-primary-100 hover:bg-icf-primary-50">
                                    <td className="px-4 py-3 text-icf-primary-300">{row.cargo}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                            {row.nivel}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-icf-primary-300">{row.acessos}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notificações */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-base font-semibold text-icf-primary-400 mb-3">Notificações</h2>
                <div className="space-y-3">
                    {notificacoes.map((notif) => (
                        <div key={notif.id} className="flex items-center justify-between py-3 px-4 bg-icf-primary-50 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium text-icf-primary-400 text-sm">{notif.label}</p>
                                {notif.descricao && (
                                    <p className="text-xs text-icf-primary-300">{notif.descricao}</p>
                                )}
                            </div>
                            <Switch
                                checked={notif.ativo}
                                onCheckedChange={() => handleNotificacaoToggle(notif.id)}
                                className="bg-green-600"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
