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
