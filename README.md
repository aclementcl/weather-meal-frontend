# WeatherMeal Frontend

La aplicación permite elegir una región y ciudad de Chile, seleccionar una fecha entre hoy y los próximos 6 días, consultar el clima, pedir una sugerencia de menú y guardar menús favoritos.


## Funcionalidades

- Selector de región y ciudad de Chile consumido desde el backend.
- Ubicación inicial sugerida con geolocalización del navegador y fallback a la primera ciudad soportada.
- Selector de fecha limitado al rango permitido por el challenge.
- Consulta visual del pronóstico para ciudad y fecha.
- Sugerencia de desayuno, almuerzo y cena generada por el backend.
- Preferencias alimenticias opcionales.
- Guardado, listado y eliminación de menús favoritos.
- Frontend dockerizado y preparado para despliegue en servidor.

## Decisiones Técnicas

### Angular standalone

Se usa Angular con componentes standalone para reducir boilerplate y mantener el proyecto simple. La aplicación está organizada por feature, no por capas técnicas globales.

Estructura principal:

```text
src/app/
  core/
    models/
    services/
  features/
    weather-planner/
      components/
      pages/
      models/
```

### API propia como frontera

El frontend no llama APIs externas directamente. Todas las operaciones pasan por el backend:

```text
GET    /api/v1/locations/chile/regions
GET    /api/v1/locations/chile/regions/:regionId/cities
GET    /api/v1/locations/chile/cities/:cityId/weather?date=YYYY-MM-DD
POST   /api/v1/locations/chile/cities/:cityId/menu-suggestions
GET    /api/v1/favorites
POST   /api/v1/favorites
DELETE /api/v1/favorites/:id
```

Esto mantiene las llaves, proveedores externos y reglas de negocio fuera del navegador.

### Proxy local y proxy productivo

En desarrollo, Angular usa `proxy.conf.json` para reenviar `/api` al backend local. En producción, Nginx sirve el build estático y también proxyea `/api` hacia `BACKEND_URL`. Así el código del frontend siempre consume rutas relativas y no depende de una URL hardcodeada.

## Requisitos

- Node.js 22
- npm
- Backend WeatherMeal corriendo
- Docker, solo para ejecución containerizada o deploy

## Variables de Entorno

El frontend usa variables solo en Docker/Nginx. Para desarrollo con `ng serve`, basta con `proxy.conf.json`.

Archivo de referencia:

```bash
cp .env.sample .env
```

Variables:

```env
FRONTEND_PORT=8080
BACKEND_URL=http://host.docker.internal:3000
```

`BACKEND_URL` debe ser la URL del backend vista desde el contenedor frontend. Si el backend está publicado en el mismo servidor por IP pública, puede ser:

```env
BACKEND_URL=http://206.189.197.214:3000
```

Evitar slash final en `BACKEND_URL`, porque puede afectar la forma en que Nginx reenvía `/api/v1/...`.

## Ejecución Local

Instalar dependencias:

```bash
npm ci
```

Levantar el backend en `http://localhost:3000`.

Levantar el frontend:

```bash
npm start
```

Abrir:

```text
http://localhost:4200
```

## Build

```bash
npm run build -- --progress=false
```

El build queda en:

```text
dist/frontend/browser
```

## Docker

Construir imagen:

```bash
docker build -t weathermeal-frontend .
```

Ejecutar contra backend local:

```bash
docker run --rm -p 8080:80 -e BACKEND_URL=http://host.docker.internal:3000 weathermeal-frontend
```

Abrir:

```text
http://localhost:8080
```

## Docker Compose

Crear `.env` desde el sample:

```bash
cp .env.sample .env
```

Levantar:

```bash
docker compose up --build -d
```

Ver logs:

```bash
docker logs weathermeal-frontend
```

Probar el proxy desde el servidor:

```bash
curl -i http://localhost:8080/api/v1/locations/chile/regions
```
