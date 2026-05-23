# Internship Project Report

## Project title

**BDA Sales Workspace** — Team & Lead Management for a Manufacturing Company

## Problem statement

Business Development teams in manufacturing often track leads in spreadsheets. Stages get outdated, managers cannot see the pipeline at a glance, and there is no simple history of who changed what. This project replaces that with one web dashboard.

## Objectives completed

1. Secure user registration and login (JWT)
2. CRUD for leads with assignment to team members
3. Visual pipeline (Kanban) with drag-and-drop stage updates
4. Team member management with basic performance counts
5. Dashboard charts and activity timeline
6. Responsive layout for laptop and mobile

## Technology used


| Layer    | Tools                                                                |
| -------- | -------------------------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Recharts, dnd-kit |
| Backend  | Node.js, Express.js                                                  |
| Database | MongoDB, Mongoose                                                    |
| Auth     | bcryptjs, jsonwebtoken                                               |


## Architecture (short)

- REST API on port **5000**
- React SPA on port **5173** (Vite dev proxy sends `/api` to the backend)
- MongoDB stores users, leads, team members, and activity records
- Each API request for leads/team checks the JWT and filters by `createdBy`

## How to demo for faculty

1. Run backend and frontend (see main README)
2. Register as `galipellivishnuchandra999@gmail.com`
3. Add 2 team members
4. Create 4–5 leads in different stages
5. Show Dashboard charts updating
6. Drag a lead on Pipeline from *Negotiation* to *Proposal Sent*
7. Open Activities to show the log entry

## Future improvements (if I continue)

- Email notifications on stage change
- Export leads to Excel
- Role-based permissions (manager vs BDA)
- Dark theme toggle

## Declaration

This project was developed by me as part of my internship training. I understand the code structure and can explain any module during viva or review.

**Name:** Vishnu Chandra Galipelli  
**Date:** May 2026