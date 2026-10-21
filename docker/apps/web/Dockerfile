# syntax=docker/dockerfile:1

# --- Etapa dev: servidor de Vite con hot-reload ---
FROM node:20-alpine AS dev
WORKDIR /app
COPY apps/web/package*.json ./
RUN npm install
COPY apps/web/ ./
COPY packages/ui /packages/ui
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- Etapa build: compila el bundle estático ---
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY apps/web/package*.json ./
RUN npm install
COPY apps/web/ ./
COPY packages/ui /packages/ui
RUN ln -s /app/node_modules /packages/node_modules
RUN npm run build

# --- Etapa prod: Nginx sirviendo el estático, imagen final liviana ---
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
