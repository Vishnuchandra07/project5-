# Before you submit to your sir

## Files to include in ZIP / GitHub

- [ ] Full project folder (`server` + `client`)
- [ ] `README.md` — how to run
- [ ] `INTERNSHIP_REPORT.md` — project explanation
- [ ] `server/.env.example` (do **not** upload real `.env` with secrets)

## Personalize these

1. Open `INTERNSHIP_REPORT.md` — add your **full name**, **college**, **roll number**, **guide name**
2. Open `README.md` — update the “Submitted by” line at the bottom
3. Change `author` in `package.json` files if needed

## Demo preparation (5 minutes)

1. Show registration + login
2. Add 2 team members
3. Create 3 leads in different stages
4. Open Pipeline and drag one card
5. Show Dashboard numbers and Activity history

## Viva tips

Be ready to explain:

- What JWT does and where the token is stored (`localStorage`)
- How `createdBy` keeps each user’s data separate
- Difference between `PUT /leads/:id` and `PATCH /leads/:id/stage`
- Why you chose MongoDB + Mongoose

## Run once before submission

```bash
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

Both must work on your laptop without errors.
