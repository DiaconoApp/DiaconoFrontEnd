# DiaconoFrontEnd

## 📌 Objetivo
Frontend web para autenticação, cadastro inicial e gestão operacional de uma igreja, com acesso a eventos, escalas, membros, ministérios, financeiro, perfil e dashboards conforme o cargo do usuário.

## 🎯 Funcionalidades Principais
- Login com email/senha e com Google, salvando token e dados de sessão em `localStorage`.
- Cadastro em etapas com validações locais de nome, CPF, email, senha, cargo e endereço.
- Navegação protegida por cargo, com visões diferentes para `GOVERNO`, `LIDER_MINISTERIO` e `MEMBRO`.
- Agenda de eventos com criação, edição, visualização e exclusão, incluindo recorrência e vínculo com ministérios.
- Gestão de escalas por mês, com filtros por ministério, busca textual e status quando o cargo permite.
- Gestão de membros e ministérios com listagem paginada, cadastro, edição e associação entre entidades.
- Tela de perfil com edição parcial dos campos alterados e preenchimento de endereço por CEP.
- Dashboards separados para membros e ministérios, com KPIs e gráficos baseados em Recharts.

## 🛠️ Tecnologias
- React 19
- Vite
- React Router DOM
- Axios
- JWT Decode
- Google OAuth via `@react-oauth/google`
- FullCalendar
- Recharts
- Radix UI
- Tailwind CSS
- Lucide React

## 🧩 Estrutura Relevante
- `src/routes`: rotas, contexto de autenticação, permissões e proteção de acesso.
- `src/services`: camada de integração HTTP e montagem de payloads para auth, eventos, escalas, membros, ministérios, perfil e dashboards.
- `src/components/pages`: telas de alto nível como login, cadastro, eventos, escalas, membros, ministérios, perfil, financeiro e dashboard.
- `src/components/templates` e `src/components/molecules`: composição dos fluxos principais, inclusive calendário, listas e modais de ação.
- `src/hooks`: validações e regras reutilizáveis, principalmente cadastro, permissão e CEP.
- `src/provider/api.js`: cliente Axios com base URL dinâmica e interceptor de autorização.

## 🔄 Fluxos de UI Críticos
- Autenticação: `FormsLogin.jsx` e o fluxo Google chamam `services/login.js` → decodificam JWT → gravam `token`, `cargo`, `nome`, `fk_igreja` e `idUsuario` em `localStorage` → `AuthContext` mantém o cargo em memória → `ProtectedRoute.jsx` libera ou bloqueia acesso.
- Cadastro em etapas: `Cadastro1.jsx` a `Cadastro4.jsx` compartilham `CadastroContext` → `useValidacaoCadastro.js` valida campos e CEP → `FormsCadastro3.jsx` finaliza o envio em `/register`.
- Eventos: `Calendario.jsx` busca eventos e abre detalhes com `ModalVisualizarEvento.jsx` → `FormEventos.jsx` valida campos obrigatórios → `services/eventos.js` envia POST ou PATCH para o backend.
- Escalas: `Escalas.jsx` escolhe a fonte conforme cargo → normaliza filtros de mês, ano, status e ministério → renderiza `CardEscala` → abre `ModalEscalarMinisterios.jsx` para governo ou `ModalGerenciarEscala.jsx` para líder.
- Perfil: `Perfil.jsx` carrega dados do usuário logado → ao editar, compara valores originais e atuais → envia somente o payload alterado para `services/perfil.js`.
- Dashboards: `Dashboard.jsx` alterna entre abas de membros e ministérios → busca KPIs em `services/dashboards.js` → alimenta cartões e gráficos.

## 🧠 Regras de Negócio no Front
- A autorização depende de cargo e permissões definidas em `routes/roles.js`; o front remove menus e bloqueia rotas antes de chamar a tela.
- Em `ProtectedRoute.jsx`, ausência de token limpa a sessão e redireciona para `/login`; acesso sem permissão redireciona para `/unauthorized`.
- O cargo `MEMBRO` não pode criar evento pelo calendário; a interface desabilita essa ação.
- O filtro de status de escalas é enviado em maiúsculas para a API, exceto quando a opção é “todos”.
- Em escalas de líder, membros confirmados são pré-selecionados e a confirmação não prossegue sem seleção mínima.
- Em eventos recorrentes, a exclusão pode ser única ou em múltiplas ocorrências.
- Em membros e perfil, o front monta patch parcial e evita requisições quando não há alteração real.
- A busca por CEP completa endereço automaticamente quando o CEP tem 8 dígitos válidos.
- O cadastro bloqueia avanço se houver campos obrigatórios vazios, senha inválida ou confirmação divergente.

## 🌐 Integração com Backend
- Autenticação:
	- `POST /api/v1/auth/login`
	- `POST /api/v1/auth/google`
- Cadastro e perfil:
	- `POST /register`
	- `GET /perfil`
	- `GET /perfil/{idUsuario}`
	- `PATCH /perfil`
- Eventos:
	- `GET /api/v1/eventos`
	- `GET /api/v1/eventos/{id}`
	- `POST /api/v1/eventos`
	- `PATCH /api/v1/eventos/{id}`
	- `DELETE /api/v1/eventos/unico/{id}`
	- `DELETE /api/v1/eventos/multiplos/{id}`
- Escalas:
	- `GET /api/v1/escalas-evento/governo`
	- `GET /api/v1/escalas-evento/governo/{eventoId}`
	- `PATCH /api/v1/escalas-evento/governo/{eventoId}`
	- `GET /api/v1/escalas-ministerio/lider-ministerio`
	- `GET /api/v1/escalas-ministerio/lider-ministerio/{idExternoEscalaEvento}`
	- `PATCH /api/v1/escalas-ministerio/lider-ministerio/{idExternoEscalaEvento}`
	- `GET /api/v1/escalas-ministerio/lider-ministerio/{idExternoEscalaEvento}/{tamanhoEquipe}`
	- `POST /api/v1/escalas-ministerio/lider-ministerio/{idExternoEscalaEvento}/revisar-randomizacao/{idExternoMembroMinisterio}`
	- `GET /api/v1/escalas-ministerio/membro`
- Membros e ministérios:
	- `GET /api/v1/membros`
	- `GET /api/v1/membros/{idExterno}`
	- `POST /api/v1/membros`
	- `PATCH /api/v1/membros/{idExterno}`
	- `GET /api/v1/ministerios`
	- `GET /api/v1/ministerios/governo`
	- `GET /api/v1/ministerios/lider-ministerio`
	- `GET /api/v1/ministerios/lider-ministerio/{idMinisterio}`
	- `GET /api/v1/ministerios/membro`
	- `POST /api/v1/ministerios/governo`
	- `PATCH /api/v1/ministerios/governo/{idMinisterio}`
	- `PATCH /api/v1/ministerios/lider-ministerio/{idMinisterio}`
	- `DELETE /api/v1/ministerios/lider-ministerio/{idMinisterio}/{idMembro}`
- Dashboards:
	- `GET /api/v1/dashboards/membros/kpis`
	- `GET /api/v1/dashboards/membros/genero`
	- `GET /api/v1/dashboards/membros/faixa-etaria`
	- `GET /api/v1/dashboards/membros/evolucao`
	- `GET /api/v1/dashboards/ministerios/kpis`
	- `GET /api/v1/dashboards/ministerios/quantidade-membros`
	- `GET /api/v1/dashboards/ministerios/quantidade-eventos`
	- `GET /api/v1/dashboards/ministerios/evolucao/{idMinisterio}`
