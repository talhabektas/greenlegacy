# Yeşil Miras 

A sustainable real estate tokenization platform democratizing property investment. By fractionalizing premium ecofriendly properties through blockchain technology, we enable low-capital investors to access high-quality real estate with
minimal entry barriers. Featuring real-time sustainability monitoring via IoT sensors, innovative digital farming concept,
and carbon economy integration.

# 🌿 Yesil Miras Backend

## Requirements

- Go 1.22 or higher
- PostgreSQL 15 or higher
- Docker and Docker Compose (optional)

## Installation

1. Clone the project:
```bash
git clone https://github.com/talhabektas/yesil-miras.git
cd yesil-miras/yesil-miras-backend
```

2. Download dependencies:
```bash
go mod download
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Create the database:
```bash
createdb yesil_miras
```

5. Run the application:
```bash
go run cmd/main.go
```

## Running with Docker

1. Start all services with Docker Compose:
```bash
docker-compose up --build
```

2. Stop the services:
```bash
docker-compose down
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get a specific project

### Tasks
- `POST /api/tasks` - Create a new task
- `GET /api/projects/:projectId/tasks` - List tasks for a project

### Comments
- `POST /api/comments` - Create a new comment
- `GET /api/tasks/:taskId/comments` - List comments for a task

## Project Structure

```
.
├── cmd/
│   └── main.go
├── internal/
│   ├── api/
│   │   ├── handlers.go
│   │   └── routes.go
│   ├── domain/
│   │   └── models.go
│   ├── repository/
│   │   └── repository.go
│   └── service/
│       └── service.go
├── pkg/
├── configs/
├── docs/
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
└── .env
```

## Development

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Commit your changes:
```bash
git commit -m "Add your feature"
```

3. Push your branch:
```bash
git push origin feature/your-feature-name
```

4. Open a Pull Request.


## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın. 
