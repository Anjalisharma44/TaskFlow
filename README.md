# TaskFlow — Dockerized Task Manager

A small task manager with an HTML/CSS/JavaScript frontend, Spring Boot REST API, and MySQL database.

## Project structure

```text
TaskFlow/
├── .github/workflows/deploy.yml
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/taskflow/
│       │   ├── TaskFlowApplication.java
│       │   ├── Task.java
│       │   ├── TaskController.java
│       │   └── TaskRepository.java
│       └── resources/application.properties
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── nginx.conf
├── .env.example
└── docker-compose.yml
```

## Run locally with Docker Desktop

1. Open this folder in VS Code / terminal.
2. Optional: copy `.env.example` to `.env` and change the demo passwords.
   - PowerShell: `Copy-Item .env.example .env`
   - CMD: `copy .env.example .env`
3. Build and start all services:

   ```bash
   docker compose up --build -d
   ```

4. Open **http://localhost:3000**.
5. Check service status and logs:

   ```bash
   docker compose ps
   docker compose logs --tail=100 backend
   docker compose logs --tail=100 mysql
   ```

6. Stop services:

   ```bash
   docker compose down
   ```

To stop and also delete the saved task database volume (this permanently deletes stored tasks):

```bash
docker compose down -v
```

## Database connection

Docker Compose starts MySQL and waits for its health check before starting the backend. The backend connects to the MySQL service by its Compose hostname `mysql` on port `3306`; **do not use `localhost` from inside the backend container**. Hibernate creates/updates the `tasks` table automatically (`spring.jpa.hibernate.ddl-auto=update`).

The frontend talks to `/api/tasks`; Nginx forwards `/api/` requests to `backend:8080`. This avoids exposing the backend port directly to the host.

## API

- `GET /api/tasks` — list tasks
- `POST /api/tasks` — add a task. JSON body: `{"task":"Finish assignment"}`

## GitHub Actions → Docker Hub

In your GitHub repository, open **Settings → Secrets and variables → Actions** and add:
- `DOCKERHUB_USERNAME` — your Docker Hub username
- `DOCKERHUB_TOKEN` — a Docker Hub access token (not your account password)

The workflow builds and pushes two images:
- `<your-dockerhub-username>/taskflow-frontend:latest`
- `<your-dockerhub-username>/taskflow-backend:latest`

The username secret must match the Docker Hub account that owns both repositories. Ensure those repositories exist or your account can create/push to them. Workflow triggers on pushes to `main` and can also be run manually from the Actions tab.

## Notes

- `.env` is ignored by Git; do not commit real passwords.
- The default values are for local demonstration only. Change them before deploying publicly.
