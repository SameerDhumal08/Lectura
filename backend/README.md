# Lectura — Spring Boot Backend

REST API mirroring the React frontend (users, courses, enrollments, lectures, notifications) with JWT-based role auth (admin / teacher / student). Uses H2 in-memory DB so it runs with zero config.

## Run

```bash
./mvnw spring-boot:run        # or: mvn spring-boot:run
```

Server starts on `http://localhost:8081`. H2 console at `/h2` (jdbc URL `jdbc:h2:mem:lectura`, user `sa`, no password).

## Demo accounts (auto-seeded)

| Email                  | Password   | Role    |
|------------------------|-----------|---------|
| admin@lectura.dev      | password  | admin   |
| teacher@lectura.dev    | password  | teacher |
| student@lectura.dev    | password  | student |

## Auth

```
POST /api/auth/signup    { email, fullName, password }   → { token, user }
POST /api/auth/login     { email, password }             → { token, user }
```

Send the token on every other call:  `Authorization: Bearer <token>`

## Endpoints

| Method | Path | Role |
|--------|------|------|
| GET    | /api/users/me                       | any |
| GET    | /api/users?role=teacher\|student    | admin |
| POST   | /api/users                          | admin |
| DELETE | /api/users/{id}                     | admin |
| PUT    | /api/users/{id}/role                | admin |
| GET    | /api/courses                        | any |
| POST   | /api/courses                        | admin |
| DELETE | /api/courses/{id}                   | admin |
| GET    | /api/courses/{id}/roster            | admin, teacher |
| POST   | /api/courses/{id}/enroll            | admin (toggles enrollment) |
| GET    | /api/lectures                       | any (scoped to caller) |
| POST   | /api/lectures                       | admin (auto-generates Meet link + notifications) |
| DELETE | /api/lectures/{id}                  | admin |
| GET    | /api/notifications                  | any (own) |
| PUT    | /api/notifications/{id}/read        | any (own) |
| PUT    | /api/notifications/read-all         | any (own) |

## Wire to the React frontend

In `src/store.js` replace the localStorage calls with `fetch('http://localhost:8081/api/...', { headers: { Authorization: 'Bearer ' + token } })`.

CORS is open to `http://localhost:5173` and `http://localhost:3000` (configure in `application.properties`).

## Configuration

Edit `src/main/resources/application.properties`:
- `app.jwt.secret` — change before deploying.
- `app.jwt.expiration-ms` — token lifetime (default 24h).
- `app.cors.allowed-origins` — comma-separated.
- Swap H2 for Postgres by setting `spring.datasource.url`, `username`, `password`, and adding the postgres driver to `pom.xml`.
