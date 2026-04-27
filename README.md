# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Docker

Build the frontend image:

```bash
docker build -t weathermeal-frontend .
```

Run the container against a backend running on the host machine at port `3000`:

```bash
docker run --rm -p 8080:80 -e BACKEND_URL=http://host.docker.internal:3000 weathermeal-frontend
```

Open `http://localhost:8080/`.

The container serves the Angular production build with Nginx. Requests to `/api/*` are proxied to `BACKEND_URL`, so the frontend continues consuming the backend through the same relative API paths used in local development.

## Production deployment

The repository includes a GitHub Actions pipeline at `.github/workflows/deploy.yml`. It follows the same deployment strategy as the backend:

1. Validate the Angular build on `main`.
2. Sync the repository to the server with `rsync`.
3. Run `scripts/deploy.sh` remotely.
4. Start or rebuild the container with Docker Compose.

Required GitHub environment secrets:

```text
DROPLET_HOST
DROPLET_USER
DROPLET_SSH_KEY
```

Optional GitHub environment variables:

```text
DROPLET_PORT=22
DEPLOY_PATH=/opt/weathermeal/frontend
```

Optional server `.env` values inside `DEPLOY_PATH`:

```text
FRONTEND_PORT=8080
BACKEND_URL=http://host.docker.internal:3000
```

You can use `.env.sample` as the base for the server `.env` file:

```bash
cp .env.sample .env
```

`BACKEND_URL` should point to the backend as seen from the frontend container. The default works when the backend publishes port `3000` on the same Docker host.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
