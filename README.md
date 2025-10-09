# DiaconoFrontEnd

## Contexto

O DiaconoFrontEnd é a interface do cliente. Este repositório contém a aplicação frontend responsável por fornecer telas de login e interação com serviços backend (JSON server durante desenvolvimento). A estrutura inclui uma versão React (na pasta `React/`).

## Tecnologias e dependências

- Frontend: React (Vite) — código fonte em `React/src`
- Ferramentas de build: Vite (configuração em `React/vite.config.js`)
- Estilização: CSS (arquivos em `src/` e `React/src/`)
- Desenvolvimento local: json-server (arquivo `src/json_server_db.json`) ou outro backend de desenvolvimento
- Node.js e npm/yarn para instalar dependências e rodar a aplicação

Dependências principais:

- react, react-dom, vite
- json-server (opcional para mock de API)

## Funcionalidades

- Tela de login (componentes `Login.jsx` e `BlocoLogin.jsx`).
- Componentes de interface reutilizáveis (`BlocoTexto.jsx`, `Config.jsx`).
- Suporte a desenvolvimento com backend mock via `json_server_db.json`.

## Como executar (em desenvolvimento...):
