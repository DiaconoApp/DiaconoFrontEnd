FROM node:22-alpine AS build

WORKDIR /app

COPY React/package*.json ./React/
RUN cd React && npm ci

COPY React ./React
RUN cd React && npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/React/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]