# Hotel Management Backend

Production-ready REST API for the Hotel Management System.

## Stack

- Node.js (>= 18) + Express
- MySQL via `mysql2/promise` (connection pool, transactions)
- JWT auth (`jsonwebtoken`) + `bcryptjs`
- Joi for input validation
- Morgan for request logs

## Project structure

```
backend/
├── server.js
├── package.json
└── src/
    ├── app.js
    ├── config/        # env, db pool, schema bootstrap
    ├── controllers/   # request/response only
    ├── middlewares/   # auth, validation, error handling
    ├── models/        # SQL queries (users, rooms, bookings)
    ├── routes/        # Express routers
    ├── services/      # business logic layer
    ├── utils/         # ApiError, asyncHandler, jwt, password
    └── validations/   # Joi schemas
```

## Setup

1. `cp .env.example .env` and fill credentials.
2. Create the MySQL database, e.g. `CREATE DATABASE hotel_db;`.
3. `npm install`
4. `npm run db:init` — creates `users`, `rooms`, `bookings` tables and indexes.
5. `npm run dev` — starts the API at `http://localhost:5000`.

## API

### Auth (`/api/auth`)
- `POST /register` — `{ name, email, password, role? }` → `{ user, token }`
- `POST /login` — `{ email, password }` → `{ user, token }`
- `GET /me` — auth required → current user

### Rooms (`/api/rooms`)
- `GET /` — list active rooms
- `GET /availability?checkIn=&checkOut=&capacity=` — availability search
- `GET /:id`
- `POST /` — staff/admin
- `PATCH /:id` — staff/admin
- `DELETE /:id` — admin only

### Bookings (`/api/bookings`) — auth required
- `POST /` — create booking (date validation + double-booking guard)
- `GET /me` — current user's bookings
- `GET /` — staff/admin list
- `GET /:id`
- `POST /:id/cancel`
- `PATCH /:id/status` — staff/admin

### Users (`/api/users`) — admin only
- `GET /`
- `GET /:id`

## Booking integrity guarantees

- Date range validated: `check_in >= today` and `check_out > check_in`.
- Guest count checked against room capacity.
- Overlap prevention enforced inside a transaction:
  - `SELECT ... FOR UPDATE` against the indexed `(room_id, check_in, check_out)` range acquires gap locks under InnoDB REPEATABLE READ, blocking any concurrent transaction from inserting an overlapping booking.
  - Half-open overlap rule: `existing.check_in < new.check_out AND existing.check_out > new.check_in`.
  - Only `pending`/`confirmed` bookings count toward conflicts.
- DB-level `CHECK (check_out > check_in)` constraint as a safety net.

## Error format

All errors return:

```json
{ "success": false, "error": { "message": "...", "details": [ ... ] } }
```

`details` is included for validation errors and known MySQL constraint violations (`ER_DUP_ENTRY`, `ER_NO_REFERENCED_ROW_2`, `ER_ROW_IS_REFERENCED_2`, `ER_CHECK_CONSTRAINT_VIOLATED`, etc).
