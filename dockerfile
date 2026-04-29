# ==========================================
# Estágio 1: Build da Aplicação React (Vite)
# ==========================================
# React 19 + Vite 7 requerem Node moderno. Ajuste via --build-arg NODE_VERSION=<versao>.
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS builder

# --- Adicione aqui as variáveis que seu React precisa ---
ARG VITE_API_URL
# Opcional: Define ela como variável de ambiente para o processo de build
ENV VITE_API_URL=$VITE_API_URL 

WORKDIR /app

# Copia dependências do frontend (que está em /React)
COPY React/package.json React/package-lock.json* ./

# Usa npm ci para build reproduzível em produção
RUN npm ci

# Copia o restante do código do frontend e gera o build
COPY React/ ./
RUN npm run build

# ==========================================
# Estágio 2: Servidor de Produção (Nginx)
# ==========================================
FROM nginx:alpine

# Usa configuração customizada do Nginx, se necessário para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Publica os arquivos estáticos do Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]