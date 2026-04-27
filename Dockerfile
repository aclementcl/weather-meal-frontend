FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --progress=false

FROM nginx:1.27-alpine

ENV BACKEND_URL=http://host.docker.internal:3000

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
