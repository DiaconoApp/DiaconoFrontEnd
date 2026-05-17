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

## Funcionalidades

- Tela de login (componentes `Login.jsx` e `BlocoLogin.jsx`).
- Componentes de interface reutilizáveis (`BlocoTexto.jsx`, `Config.jsx`).
- Suporte a desenvolvimento com backend mock via `json_server_db.json`.

## CI/CD Pipeline

### Continuous Integration (CI)
- **Trigger**: Pull Requests e Push para `main`
- **O que executa**: Lint e Build
- **Arquivo**: `.github/workflows/ci.yml`

### Continuous Deployment (CD)
- **Trigger**: Criação de tags (`v*`) ou execução manual
- **O que executa**: Build do frontend, empacotamento em imagem Docker e push para GHCR
- **Arquivo**: `.github/workflows/cd.yml`

### Como o CD funciona
- O workflow usa o `Dockerfile` na raiz do repositório.
- A imagem final serve a aplicação Vite via `nginx` usando o `nginx.conf` do projeto.
- O repositório envia a imagem para `ghcr.io/<owner>/diacono-frontend`.

### Tags e Deploy Docker

#### Como criar uma tag:
```bash
git tag v1.0.0  # Criar tag localmente
git push origin v1.0.0  # Push da tag para disparar CD
```

#### Testar localmente:
```bash
docker build -t diacono-frontend:latest .
docker run -p 80:80 diacono-frontend:latest
```

#### Observação sobre Docker Hub
Se a meta for publicar no Docker Hub em vez de GHCR, o workflow precisa trocar o registry e usar secrets do Docker Hub (`DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN`).

## Como executar (em desenvolvimento...):
