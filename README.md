# # BDA Team Management System

A modern SaaS-style dashboard for Business Development Associate teams to manage leads, sales pipelines, and team performance.

## 🔗 Live Demo

- **Frontend:** [https://project5-plum-eight.vercel.app](https://project5-plum-eight.vercel.app)

- **Backend:** [https://project5-production.up.railway.app](https://project5-production.up.railway.app)

## 🔑 Test Credentials

- **Email:** [vishnu@test.com](mailto:vishnu@test.com)

- **Password:** 123456

## ✨ Features

- JWT Authentication (Register/Login/Logout)

- Dashboard with KPI cards and charts

- Lead Management (Create, Edit, Delete, Assign)

- Kanban Pipeline Board (Drag and Drop)

- Team Management and Performance Tracking

- Activity Timeline

- Search and Filter

- Responsive Design (Mobile/Tablet/Desktop)

## 🛠️ Tech Stack

**Frontend:**

- React.js (Vite)

- Tailwind CSS

- Recharts

- Axios

- React Router

**Backend:**

- Node.js

- Express.js

- MongoDB

- Mongoose

- JWT Authentication

## 📁 Folder Structure  
BDA Module/ 

├── client/ # React Frontend 

└── server/ # Node.js Backend



## ⚙️ Local Setup

### Backend

```bash

cd server

npm install

npm run dev

```

### Frontend

```bash

cd client

npm install

npm run dev

```

### Environment Variables

Create `server/.env`:

MONGO_URI=mongodb+srv://galipellivishnuchandra999_db_user:[Vishnu2024@cluster0.pllbu9d.mongodb.net](mailto:Vishnu2024@cluster0.pllbu9d.mongodb.net)/bda-system?retryWrites=true&w=majority

JWT_SECRET=mysecretkey123

PORT=5000