# BDA Sales Workspace

**Internship project — Manufacturing company BD team management**

A full-stack web app I built to help Business Development Associates track leads, move deals through a pipeline, and see how the team is performing. The stack is React (Vite) on the front and Node.js + Express + MongoDB on the back, with login handled using JWT.

---

## What this project does

- Login and registration for each user (data is kept separate per account)
- Dashboard with lead counts, revenue chart, and recent updates
- Lead list with search, filters, create / edit / delete
- Kanban board — drag cards to change deal stage
- Team page to add BDAs and see their numbers
- Activity log when leads or team members change

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 or higher |
| npm | Comes with Node |
| MongoDB | Local install **or** MongoDB Atlas free cluster |

---

## How to run (step by step)

### 1. Start MongoDB

- **Windows:** Start the “MongoDB Server” service, or run `mongod` if you installed manually.
- **Atlas:** Copy your connection string into `server/.env` as `MONGODB_URI`.

### 2. Backend (Terminal 1)

```bash
cd server
npm install
copy .env.example .env
```

Edit `.env` if needed, then:

```bash
npm run dev
```

Wait until you see `MongoDB connected` and `Server running ... on port 5000`.

Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Frontend (Terminal 2)

```bash
cd client
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

### 4. First use

1. Register a new account  
2. Add a few team members under **Team**  
3. Create leads under **Leads**  
4. Open **Pipeline** and drag cards between columns  

---

## Folder layout

```
BDA Module/
├── server/          API (Express + Mongoose)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── client/          React UI (Vite + Tailwind)
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        └── services/
```

---

## Environment variables (`server/.env`)

| Variable | Purpose |
|----------|---------|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | Database connection |
| `JWT_SECRET` | Secret for signing tokens — change this before any real deployment |
| `JWT_EXPIRE` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend URL for CORS (`http://localhost:5173`) |

---

## API overview

| Area | Base path |
|------|-----------|
| Auth | `/api/auth` |
| Leads | `/api/leads` |
| Team | `/api/team` |
| Dashboard | `/api/dashboard` |
| Activities | `/api/activities` |

Protected routes need header: `Authorization: Bearer <token>`

More detail: [server/README.md](./server/README.md)

---

## Lead pipeline stages

`New` → `Contacted` → `Negotiation` → `Proposal Sent` → `Closed Won` / `Closed Lost`

---

## Notes for evaluation

- I used **Context API** for auth state instead of Redux to keep the front end simpler.
- **@dnd-kit** powers the Kanban drag-and-drop on the pipeline page.
- Lead and team data are scoped to the logged-in user (`createdBy` on the server).
- This repo is for learning and internship submission; swap `JWT_SECRET` and use HTTPS before any public hosting.

---

**Submitted by:** Vishnu (update with your roll number / college if required)
