# Estándares de desarrollo — Portfolio Sandbox

Estas reglas aplican a todos los proyectos bajo este sandbox. Cada proyecto puede añadir un `.claude/CLAUDE.md` local con convenciones específicas de dominio.

---

## Stack aprobado

### Backend
- **Lenguaje**: Python ≥3.12
- **Framework**: FastAPI (async handlers por defecto)
- **Validación**: Pydantic v2 (`model_config`, no `class Config`)
- **ORM**: SQLAlchemy 2.x con sintaxis declarativa (`mapped_column`, `Mapped`)
- **Migraciones**: Alembic (una migración por cambio de schema, nunca `create_all` en producción)
- **Servidor**: Uvicorn con `--reload` en dev
- **HTTP client**: httpx (async)
- **Linting**: ruff (reemplaza black + isort + flake8)

### Base de datos
- **Producción**: PostgreSQL 16+
- **Desarrollo local / proyectos ligeros**: SQLite (con SQLAlchemy, misma interfaz)
- Nunca hardcodear connection strings; siempre via `settings.py` + `.env`

### Frontend
- **Framework**: React 18+ con TypeScript 5+
- **Build**: Vite
- **Estilos**: TailwindCSS + shadcn/ui (componentes) o Radix UI (primitivos)
- **Gráficos**: Apache ECharts (via echarts-for-react) o Recharts
- **Estado global**: Zustand (ligero) o React Context para apps simples
- **Linting**: ESLint + Prettier

### Infraestructura
- **Contenedores**: Docker + Docker Compose obligatorio en todos los proyectos
- **Servicios en compose**: `api`, `db`, `frontend`; opcional `nginx` para producción
- **Reverse proxy**: Nginx
- **Variables**: `.env` para desarrollo, nunca secretos en `docker-compose.yml`

### Testing
- **Backend**: pytest + pytest-asyncio; tests de integración contra DB real (no mocks de DB)
- **Frontend**: Vitest + React Testing Library
- **Fixtures**: datos de prueba explícitos en archivos `tests/fixtures/`

---

## Arquitectura backend estándar

```
app/
├── main.py          # FastAPI init, include_router, lifespan hooks
├── settings.py      # Pydantic BaseSettings + carga de .env
├── db.py            # engine, async_sessionmaker, Base
├── models.py        # SQLAlchemy ORM (una clase por entidad)
├── schemas.py       # Pydantic schemas de request/response
├── dependencies.py  # get_db, get_current_user, etc.
└── routes/
    └── <dominio>.py # Un archivo por recurso/dominio
```

### Convenciones de API
- Prefijo `/api/v1/` para todos los endpoints
- Estructura de respuesta consistente:
  ```json
  { "data": ..., "meta": { "total": ... } }
  { "error": { "code": "NOT_FOUND", "message": "..." } }
  ```
- HTTP status codes semánticos (201 para creación, 204 para delete, etc.)
- OpenAPI habilitado en `/docs` (no deshabilitar en dev)

---

## Seguridad

- Nunca hardcodear secretos, tokens o passwords en código ni en compose
- Siempre incluir `.env.example` con todas las variables (sin valores reales)
- Tokens/credenciales en DB: cifrar con Fernet (`cryptography`)
- Auth web: cookies httpOnly para sesiones (no `localStorage` para tokens sensibles)
- JWT: access token 15min, refresh token 7d
- OAuth2/OIDC: usar PKCE para flujos de browser

---

## Docker estándar

Cada proyecto incluye:
```
Makefile              # targets: dev, test, build, lint, down
docker-compose.yml    # desarrollo (con volumes para hot reload)
docker-compose.test.yml  # CI/testing aislado
.env                  # no commiteado
.env.example          # commiteado, sin valores reales
```

`Makefile` mínimo:
```makefile
dev:
	docker compose up --build

test:
	docker compose -f docker-compose.test.yml run --rm api pytest

lint:
	docker compose run --rm api ruff check .

down:
	docker compose down -v
```

---

## Convenciones de código

- Sin comentarios salvo cuando el WHY no es obvio (restricción oculta, workaround de bug específico)
- Nombres en inglés para código (variables, funciones, clases, archivos)
- Documentación, READMEs y commits pueden ser en español o inglés (consistente por proyecto)
- Sin abstracciones prematuras: 3 líneas similares no justifican un helper
- Sin manejo de errores para escenarios imposibles; validar solo en boundaries del sistema
- Tests de integración sobre DB real; no mockear lo que se puede probar de verdad

---

## README estándar por proyecto

Todo proyecto incluye un `README.md` con:
1. Descripción (1-2 párrafos, qué problema resuelve)
2. Arquitectura (diagrama ASCII o imagen)
3. Tech stack (tabla o lista)
4. Quickstart (`git clone` → `make dev` → URL en 5 pasos o menos)
5. Screenshots o GIF del flujo principal
6. Variables de entorno (link a `.env.example`)

---

## Estilo de commits

```
feat: descripción corta en presente
fix: descripción corta
docs: descripción corta
chore: descripción corta
```

Sin scope obligatorio. Mensajes en inglés o español (consistente por proyecto).
