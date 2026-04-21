- id: FRONT_RULE_001
  local:
    tipo: "component"
    nome: "src/routes/ProtectedRoute.jsx"
  condicao: "if (!token)"
  acao: "executa localStorage.clear() e redireciona para /login"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_002
  local:
    tipo: "component"
    nome: "src/routes/ProtectedRoute.jsx"
  condicao: "if (!permissions[cargo]?.includes(required))"
  acao: "nega acesso e redireciona para /unauthorized"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_003
  local:
    tipo: "hook"
    nome: "src/hooks/usePermission.js"
  condicao: "permissions[user.cargo]?.includes(feature)"
  acao: "retorna can(feature) para habilitar ou ocultar recursos"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_004
  local:
    tipo: "component"
    nome: "src/components/templates/ICF/Menu.jsx"
  condicao: "if (item.key && !can(item.key)) return null"
  acao: "remove item de navegação quando cargo não possui permissão"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_005
  local:
    tipo: "component"
    nome: "src/components/pages/ICF/Escalas.jsx"
  condicao: "if (isGoverno) ... else if (isLider) ... else"
  acao: "seleciona endpoint e visão de escalas por cargo usando buscarEscalasGoverno/buscarEscalasLider/buscarEscalasMembro"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_006
  local:
    tipo: "component"
    nome: "src/components/pages/ICF/Escalas.jsx"
  condicao: "statusFiltro === 'todos' ? '' : statusFiltro.toUpperCase()"
  acao: "normaliza status para enviar filtro de API"
  deveria_estar_no_backend: false
  impacto:
    - "regra_negocio"

- id: FRONT_RULE_007
  local:
    tipo: "component"
    nome: "src/components/pages/ICF/Escalas.jsx"
  condicao: "String(status).toUpperCase() === 'CONFIRMADO'"
  acao: "converte status de escala de membro para totalEventosMinisterioConfirmados binário (1/0)"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_008
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/ModalGerenciarEscala.jsx"
  condicao: "if (membro?.status === 'CONFIRMADO' && membro?.membroMinisterioId)"
  acao: "pré-seleciona membros confirmados em membrosSelecionados"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_009
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/ModalGerenciarEscala.jsx"
  condicao: "if (selecionadosCount === 0)"
  acao: "bloqueia confirmação de escala sem membros selecionados"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_010
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/ModalVisualizarEvento.jsx"
  condicao: "cargo === 'LIDER_MINISTERIO' || cargo === 'GOVERNO'"
  acao: "define podeEditar para permitir edição de evento"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_011
  local:
    tipo: "component"
    nome: "src/components/templates/ICF/Calendario.jsx"
  condicao: "disabled={user?.cargo === 'MEMBRO'}"
  acao: "impede criação de evento para cargo MEMBRO"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_012
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/FormEventos.jsx"
  condicao: "if (!formData.titulo.trim()) return 'O nome do evento é obrigatório.'; if (!formData.dataHoraInicio) ...; if (!formData.dataHoraFim) ..."
  acao: "valida campos obrigatórios antes de criar/editar evento"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_013
  local:
    tipo: "hook"
    nome: "src/hooks/useValidacaoCadastro.js"
  condicao: "if (!dados.nome) ... if (!dados.cpf) ... if (!dados.email) ... if (!dados.senha) ... if (dados.senha !== dados.confirmarSenha) ... if (!dados.cargo) ... if (!dados.cep || !dados.rua || !dados.bairro || !dados.cidade || !dados.numero)"
  acao: "centraliza validações de obrigatoriedade e consistência no cadastro"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_014
  local:
    tipo: "component"
    nome: "src/components/molecules/Diacono/FormsCadastro4.jsx"
  condicao: "if (cep.length === 8)"
  acao: "busca endereço por CEP e preenche rua/bairro/cidade/estado automaticamente"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_015
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/FormMembro.jsx"
  condicao: "if (cep.length === 8)"
  acao: "busca endereço por CEP e preenche rua/bairro/cidade/estado automaticamente"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_016
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/FormEditarMembro.jsx"
  condicao: "if (cep.replace(/\\D/g, '').length === 8)"
  acao: "busca endereço por CEP e preenche rua/bairro/cidade/estado automaticamente"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_017
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/FormEditarMembro.jsx"
  condicao: "if (Object.keys(payloadAlterado).length === 0)"
  acao: "evita PATCH quando não há alteração de dados"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_018
  local:
    tipo: "component"
    nome: "src/components/pages/ICF/Perfil.jsx"
  condicao: "if (Object.keys(payloadAlterado).length === 0)"
  acao: "evita PATCH de perfil quando não há campos alterados"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_019
  local:
    tipo: "component"
    nome: "src/components/pages/ICF/Perfil.jsx"
  condicao: "if (String(valorOriginal ?? '') !== String(valorAtual ?? '')) e if (enderecoAlterado)"
  acao: "monta payload parcial somente com campos efetivamente alterados"
  deveria_estar_no_backend: false
  impacto:
    - "regra_negocio"

- id: FRONT_RULE_020
  local:
    tipo: "component"
    nome: "src/components/templates/ICF/ListaMembros.jsx"
  condicao: "if (s === 'ativos') return 'ATIVO'; if (s === 'inativos') return 'INATIVO'"
  acao: "traduz filtro textual de status para enum usado na busca"
  deveria_estar_no_backend: false
  impacto:
    - "regra_negocio"

- id: FRONT_RULE_021
  local:
    tipo: "component"
    nome: "src/components/templates/ICF/ListaMinisterios.jsx"
  condicao: "if (s === 'ativo' || s === 'ativos') return 'ATIVO'; if (s === 'inativo' || s === 'inativos') return 'INATIVO'"
  acao: "traduz filtro textual de status para enum usado na busca"
  deveria_estar_no_backend: false
  impacto:
    - "regra_negocio"

- id: FRONT_RULE_022
  local:
    tipo: "component"
    nome: "src/components/templates/ICF/ListaMembros.jsx e src/components/templates/ICF/ListaMinisterios.jsx"
  condicao: "repetição de adaptarStatus em listas distintas"
  acao: "duplica regra de normalização de status em múltiplos pontos"
  deveria_estar_no_backend: false
  impacto:
    - "regra_negocio"

- id: FRONT_RULE_023
  local:
    tipo: "component"
    nome: "src/components/molecules/Diacono/FormsCadastro3.jsx"
  condicao: "if (camposVazios.length > 0 || Object.values(erros).some(e => e))"
  acao: "bloqueia finalização do cadastro e exibe erro"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_024
  local:
    tipo: "component"
    nome: "src/components/molecules/Diacono/FormsCadastro3.jsx"
  condicao: "valor === dadosCadastro.senha"
  acao: "valida confirmação de senha no cliente"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_025
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/ModalMembroMinisterio.jsx"
  condicao: "m.ministerios?.some(min => min.idExternoMinisterio === fkMinisterio)"
  acao: "define jaNoMinisterio e desabilita o botão de adicionar (disabled={jaNoMinisterio} em OpcaoSelecionar)"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_026
  local:
    tipo: "component"
    nome: "src/components/pages/ICF/Dashboard.jsx"
  condicao: "if (activeTab === 'membros') ... else if (activeTab === 'ministerios')"
  acao: "escolhe fonte de KPI e estrutura de mapeamento por aba"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_027
  local:
    tipo: "component"
    nome: "src/components/atoms/ICF/GraficoEvolucaoMembrosMinisterios.jsx"
  condicao: "if (linha[ano] === undefined) linha[ano] = 0"
  acao: "preenche meses/anos ausentes com zero para consolidar série temporal"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_028
  local:
    tipo: "component"
    nome: "src/components/molecules/Diacono/FormsCadastro4.jsx, src/components/molecules/ICF/FormMembro.jsx e src/components/molecules/ICF/FormEditarMembro.jsx"
  condicao: "repetição da regra de busca automática por CEP com tamanho 8"
  acao: "duplica regra de decisão e preenchimento de endereço em múltiplos componentes"
  deveria_estar_no_backend: false
  impacto:
    - "regra_negocio"

- id: FRONT_RULE_029
  local:
    tipo: "component"
    nome: "src/components/pages/ICF/Escalas.jsx"
  condicao: "usaNovoFormatoEscalas && <StatusToggle ... />"
  acao: "exibe filtro de status apenas para cargos GOVERNO e LIDER_MINISTERIO"
  deveria_estar_no_backend: false
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_030
  local:
    tipo: "component"
    nome: "src/components/molecules/ICF/ModalGerenciarEscala.jsx"
  condicao: "if (membro.isMembroOcupado)"
  acao: "define botão como 'Ocupado' e desabilita seleção manual do membro"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_031
  local:
    tipo: "component"
    nome: "src/components/molecules/Diacono/FormsCadastro2.jsx"
  condicao: "if (camposVazios.length > 0 || Object.values(erros).some(e => e))"
  acao: "bloqueia avanço para a próxima etapa do cadastro e exibe modal de aviso"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"

- id: FRONT_RULE_032
  local:
    tipo: "component"
    nome: "src/components/molecules/Diacono/FormsCadastro4.jsx"
  condicao: "if (camposVazios.length > 0)"
  acao: "bloqueia avanço da etapa de endereço quando campos obrigatórios não estão preenchidos"
  deveria_estar_no_backend: true
  impacto:
    - "ui"
    - "regra_negocio"