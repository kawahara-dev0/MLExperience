# MLExperience – ML workflow experience (web system)

A portfolio system that lets you run a full ML workflow from the browser: input data, preprocessing, model setup, training, and (optionally) hyperparameter optimization.

## Tech stack

### Backend
- **Python 3.12+**
- FastAPI, SQLAlchemy, Pandas, scikit-learn, PyTorch, PyTorch Lightning
- Ray Tune + Optuna (hyperparameter tuning)

### Frontend
- **React 18** + **TypeScript 5**
- Vite (build tool)
- MUI (Material UI) 6
- ESLint 9 (flat config)

### Infrastructure
- **Docker** + **Docker Compose**
- PostgreSQL 16

## Project structure

```
backend/
├── main.py                 # FastAPI entry point
├── routes/
│   └── api.py             # API routing
├── services/
│   ├── data_service.py     # Data import & preprocessing
│   ├── training_service.py # Training execution
│   └── optimize_service.py # Hyperparameter optimization
├── db/
│   └── database.py         # DB connection & queries (SQL injection safeguards)
├── models/
│   └── requests.py        # Request/response types
├── preprocessing.py       # Preprocessing logic
├── Define.py              # Constants & enums
├── Training.py             # Training logic
├── Optimize.py             # Optimization (tuning) logic
└── pyproject.toml         # Dependencies (uv/pip)

frontend/
├── src/
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Root component
│   ├── types/              # Type definitions
│   │   ├── index.ts       # Re-exports
│   │   ├── enums.ts       # Enums (INPUT_DATA, MODEL, etc.)
│   │   ├── models.ts      # Business types (NnDetail, RfHparam, etc.)
│   │   ├── constants.ts   # Constants (SIV_*, tooltips)
│   │   ├── contexts.ts    # Context types
│   │   └── api.ts        # API types (FETCH_REQ, ApiResponse)
│   ├── hooks/
│   │   ├── useApi.ts           # API calls & error handling
│   │   └── useFetchHandlers.ts # Response handling
│   └── components/
│       ├── index.ts       # Component re-exports + Context
│       ├── Common/         # Shared components
│       ├── SetInputData/  # Input data setup
│       ├── SetModel/      # Model setup
│       └── ExecTraining/  # Training execution
├── index.html
├── vite.config.ts
├── eslint.config.js       # ESLint flat config
└── package.json
```

## Quick start (Docker, recommended)

### Prerequisites
- Docker
- Docker Compose

### Steps

```bash
# 1. Create env file from example
cp .env.example .env

# 2. Build and start containers
docker-compose up -d

# Or use make
make up
```

After startup:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **PostgreSQL**: localhost:5432

### Common commands

```bash
# View logs
docker-compose logs -f

# Logs for a single service
docker-compose logs -f backend

# Stop containers
docker-compose down

# Restart
docker-compose restart

# Clean up (including volumes)
docker-compose down -v
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d --build

# Or
make prod
```

### Database initialization

On first start, the init script at `backend/db/init/init.sql` runs and creates tables. You must import real data (e.g. CSV) yourself.

```bash
# Connect to PostgreSQL container
docker exec -it mlexperience-db psql -U postgres -d mydatabase

# Example CSV import
\copy titanic FROM '/path/to/data.csv' WITH CSV HEADER;
```

---

## Local development (without Docker)

### Backend

```bash
cd backend

# Install with uv (recommended)
uv venv
uv pip install -e .

# Or with pip
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # Linux/macOS
pip install -e .
```

Set environment variables in `.env` at the project root (e.g. PostgreSQL connection). Run the app from the project root or ensure `backend` can see `.env`.

```bash
uvicorn main:app --reload --port 5000
# Or
python main.py
```

### Frontend

```bash
cd frontend

npm install
```

Copy `.env.example` to `.env` and set the API base URL (e.g. `VITE_WEBAPI_URL`).

```bash
# Dev server
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Recent changes (modernization)

### Architecture
- **Infrastructure**: Docker / Docker Compose
- **Frontend**: Webpack → Vite, React 17 → 18, TypeScript 5
- **Types**: Centralized in `types/` (enums, models, constants, API)
- **Hooks**: useApi (calls), useFetchHandlers (response handling)
- **Backend**: Split into routes, services, db, models

### Security & quality
- **API validation**: Pydantic (request type, dataset whitelist, model name, argument types/length)
- **SQL injection**: Table/dataset name whitelist
- **Timeouts**: Optimization 30 min, training 5 min (AbortController)
- **Errors**: HTTP status, timeout, network error handling
- **Env check**: Required variables validated at startup
- **Tests**: pytest for backend (e.g. validation)

### Tooling
- **Lint**: ESLint flat config + Prettier (frontend), ruff (backend)
- **Env**: CRA `REACT_APP_*` → Vite `VITE_*`
- **Tests**: pytest (backend)

## Tests

### Backend

```bash
cd backend

# Install with dev dependencies
uv pip install -e ".[dev]"

# Run tests
pytest

# Verbose
pytest -v

# Single file
pytest tests/test_validation.py
```

## Remaining work (refactor paused)

- [ ] **Naming**: Align with conventions (e.g. Python PEP 8: lowercase modules and functions)
- [ ] **File structure**: Review and simplify where needed
- [ ] **Static analysis**: Extend lint/format (e.g. pre-commit, stricter rules)
- [ ] **Automated tests**: Expand backend tests; add frontend tests
- [ ] **CI/CD**: Run lint and tests on push (e.g. GitHub Actions)
- [ ] **Pre-commit hooks**: Lint and format before commit
- [ ] **TypeScript / Python**: Stricter type checking (strict mode, mypy)
- [ ] **Documentation**: Keep ARCHITECTURE.md and API docs up to date
- [ ] **Security**: Dependency audits (npm audit, pip audit)
- [ ] *(Optional)* Performance, accessibility, E2E tests
