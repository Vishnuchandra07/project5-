# API — BDA Sales Workspace

Node.js + Express backend for the internship project.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

## Routes

### Auth (`/api/auth`)

| Method | Path | Access |
|--------|------|--------|
| POST | `/register` | Public |
| POST | `/login` | Public |
| GET | `/me` | Private |
| PUT | `/profile` | Private |

### Leads (`/api/leads`)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/` | List + `search`, `stage`, `assignedTo`, `priority` |
| GET | `/kanban` | Grouped by stage |
| GET | `/:id` | Single lead |
| POST | `/` | Create |
| PUT | `/:id` | Update |
| PATCH | `/:id/stage` | Kanban drag |
| DELETE | `/:id` | Remove |

### Team (`/api/team`)

CRUD + `GET /performance/summary`

### Dashboard (`/api/dashboard`)

- `GET /stats`
- `GET /revenue-chart`
- `GET /conversion-stats`

### Activities (`/api/activities`)

- `GET /` — recent log
- `GET /lead/:leadId` — one lead’s history

## Auth header

```
Authorization: Bearer <token>
```
