# Philip Staffing API

A robust, production-ready RESTful API for managing staff records. Built with Node.js and Express, this API provides comprehensive CRUD operations, input validation, error handling, pagination, and interactive API documentation via Swagger UI. It is designed for ease of deployment (including on Render), extensibility, and clarity of use.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Endpoints Reference](#endpoints-reference)
- [Request & Response Schemas](#request--response-schemas)
- [Validation Rules](#validation-rules)
- [Error Handling](#error-handling)
- [Pagination](#pagination)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Testing](#testing)
- [Deployment (Render)](#deployment-render)
- [Extending the API](#extending-the-api)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **CRUD**: Create, Read, Update, Delete staff members
- **Validation**: Robust request validation using `express-validator`
- **Error Handling**: Consistent, informative error responses
- **Pagination**: Built-in for staff listing
- **Security**: Helmet for HTTP headers, CORS enabled
- **Logging**: HTTP request logging with Morgan
- **Documentation**: Live Swagger UI at `/api-docs`
- **Health Check**: Simple root endpoint for uptime monitoring
- **Easy Deployment**: Ready for Render and similar platforms

---

## Tech Stack

- **Node.js** (v18+)
- **Express** (v4+)
- **Swagger UI Express** (for API docs)
- **express-validator** (for validation)
- **Morgan** (for logging)
- **Helmet** (for security headers)
- **Jest** (for testing)
- **Babel** (for ES6+ support)
- **ESLint** (for code linting)

---

## Project Structure

```
.
├── src/
│   ├── client/                # API client SDK
│   │   └── staffing-client.js
│   ├── controllers/           # Route controllers
│   │   └── staff.controller.js
│   ├── middleware/            # Custom middleware (e.g., validation)
│   │   └── validation.js
│   ├── routes/                # Express route definitions
│   │   └── staff.routes.js
│   ├── index.js               # Main app entry point
│   └── swagger.json           # OpenAPI 3.0 spec
├── test-client.js             # Example API client usage
├── package.json
├── render.yaml                # Render deployment config
└── README.md                  # This file
```

---

## API Documentation

- **Swagger UI:**  
  Visit `/api-docs` (e.g., `https://staffing-api-3.onrender.com/api-docs`) for interactive, up-to-date API docs and live testing.

- **OpenAPI Spec:**  
  The full OpenAPI 3.0 spec is in [src/swagger.json](src/swagger.json).

---

## Endpoints Reference

| Method | Endpoint         | Description                    |
|--------|------------------|--------------------------------|
| POST   | /staff           | Create a new staff member      |
| GET    | /staff           | List staff members (paginated) |
| GET    | /staff/:id       | Get staff member by ID         |
| PUT    | /staff/:id       | Update staff member by ID      |
| DELETE | /staff/:id       | Delete staff member by ID      |
| GET    | /                | Health check                   |
| GET    | /api-docs        | Swagger UI                     |

---

## Request & Response Schemas

### Staff Object

```json
{
  "id": "b5f5e5d0-9c2d-4c6b-8e3a-1f2c3d4e5f6a",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "position": "Engineer",
  "department": "Development",
  "status": "active",
  "hireDate": "2023-01-01",
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Create Staff Request

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "position": "Engineer",
  "department": "Development"
}
```

### Update Staff Request

Fields are all optional, but must be valid types:
```json
{
  "firstName": "Jane",
  "status": "on_leave"
}
```

### Paginated List Response

```json
{
  "data": [ /* array of staff objects */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

## Validation Rules

- **firstName**: required (POST), string
- **lastName**: required (POST), string
- **email**: required (POST), valid email
- **position**: required (POST), string
- **department**: optional, string
- **status**: optional (PUT), one of `active`, `inactive`, `on_leave`
- **id**: required (in path), UUID

---

## Error Handling

All errors return a JSON object:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "details": [
    { "msg": "First name is required", "param": "firstName", "location": "body" }
  ]
}
```

- 400: Validation errors
- 404: Not found
- 500: Internal server error

---

## Pagination

- Use `?page=1&limit=20` on GET `/staff` to paginate results.
- Defaults: `page=1`, `limit=20`, `limit` max is 100.

---

## Environment Variables

- `PORT`: Port to run the server (default: 3000)
- `SUPABASE_URL`: Your Supabase project URL (required)
- `SUPABASE_KEY`: Your Supabase service role key (required)

---

## Supabase Integration (Persistent Storage)

This API uses **Supabase** (PostgreSQL) for all staff data. All CRUD operations are persistent and shared across all deployments.

### 1. Exact Staff Table Schema (SQL)

**You must use this exact table schema for full compatibility.**

```sql
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  "firstName" text not null,
  "lastName" text not null,
  email text not null unique,
  position text not null,
  department text,
  status text not null default 'active',
  "hireDate" date not null default current_date,
  "createdAt" timestamp with time zone not null default now(),
  "updatedAt" timestamp with time zone not null default now()
);
```

- **Column names are case-sensitive and must match exactly.**
- **Do NOT create or use columns with different casing or spelling (e.g., `firstname`, `createdat`, etc).**
- If you have extra or incorrect columns, remove them with:

```sql
alter table staff drop column if exists "firstname";
alter table staff drop column if exists "lastname";
alter table staff drop column if exists hiredate;
alter table staff drop column if exists createdat;
alter table staff drop column if exists updatedat;
```

### 2. Environment Variables

Create a `.env` file at the project root:
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-service-key
```
- Never commit your real `.env` file to version control.
- Use `.env.example` as a template for other environments.

### 3. Install Supabase Client

```sh
npm install @supabase/supabase-js dotenv
```

### 4. Local Development
- Ensure your `.env` file is present and filled in.
- Start the server:
  ```sh
  npm start
  ```
- All staff data is now stored in Supabase and persists across restarts.

### 5. Deployment (Render)
- In your Render dashboard, add the same SUPABASE_URL and SUPABASE_KEY as environment variables.
- No other changes are needed—your API will use Supabase in production.

---

## Supabase Schema Troubleshooting

**Common errors and how to fix them:**

- **Error: `Could not find the 'firstName' column of 'staff' in the schema cache`**
  - Your table is missing the correct `firstName` column (case-sensitive).
  - Fix: Run the exact SQL above to create the table or add the column.

- **Error: `null value in column "firstname" violates not-null constraint`**
  - You have an extra, incorrect column (`firstname` lowercase) in your table.
  - Fix: Remove it using the SQL in the schema section.

- **Error: `RLS is enabled`**
  - Row Level Security is enabled and blocking access.
  - Fix: Run `alter table staff disable row level security;`

- **General tip:**
  - Always verify your table columns in the Supabase dashboard or with `\d staff` in SQL.

---

## Production Checklist

- [ ] Table schema matches the SQL above, with no extra columns.
- [ ] `.env` is present and not committed to git.
- [ ] Environment variables set in Render.
- [ ] All endpoints tested via Swagger UI.
- [ ] RLS is **disabled** on the staff table (unless you add policies).
- [ ] README and OpenAPI docs are up-to-date.

---

## Running Locally

1. **Clone the repo:**
   ```sh
   git clone https://github.com/Nwoyi/staffing-api.git
   cd staffing-api
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the server:**
   ```sh
   npm start
   ```
   Or for development with auto-reload:
   ```sh
   npm run dev
   ```

4. **Access API:**
   - Health check: [http://localhost:3000/](http://localhost:3000/)
   - Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Testing

- **Run tests:**
  ```sh
  npm test
  ```
- Tests are written using Jest and cover all main API client functions.

---

## Supabase Integration (Persistent Storage)

This API now uses **Supabase** (a hosted PostgreSQL database) for all staff data. All CRUD operations are persistent and shared across all deployments.

### 1. Supabase Setup
- The required table (`staff`) is automatically created in your Supabase project.
- You do **not** need to manage any in-memory or local storage.

### 2. Environment Variables
Create a `.env` file at the project root (not in any subfolder):
```
SUPABASE_URL=https://ecbleckbmyhtkluuadxk.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYmxlY2tibXlodGtsdXVhZHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzE0ODUsImV4cCI6MjA2MDg0NzQ4NX0.yq1VSdl3bIcjkewyNyGV3pQClKDItX1UiYs7tkCkeXg
```
- **Never commit your real `.env` file to version control.**
- Use `.env.example` as a template for other environments.

### 3. Install Supabase Client
Install the Supabase JS client:
```sh
npm install @supabase/supabase-js dotenv
```

### 4. Local Development
- Make sure your `.env` file is present and filled in.
- Start the server:
  ```sh
  npm start
  ```
- All staff data is now stored in Supabase and persists across restarts.

### 5. Deployment (Render)
- In your Render dashboard, add the same SUPABASE_URL and SUPABASE_KEY as environment variables.
- No other changes are needed—your API will use Supabase in production.

---

## Deployment (Render)

1. **Push code to GitHub.**
2. **Create a new Web Service** on [Render](https://dashboard.render.com/):
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment: Node 18+
3. **Set environment variables** (`SUPABASE_URL`, `SUPABASE_KEY`).
4. **Deploy!**
5. **Your API will be live at:**  
   `https://staffing-api-3.onrender.com/`  
   Docs at `/api-docs`.

---

## Extending the API

- **Add new endpoints:**  
  Create new route/controller files in `src/routes` and `src/controllers`.
- **Add persistent storage:**  
  The API now uses [Supabase](https://supabase.com/) (PostgreSQL) for persistent storage of staff records. All CRUD operations are backed by a real database.
  
  See the **Supabase Integration** section below for setup details.

  Replace in-memory array in `staff.controller.js` with a database (MongoDB, PostgreSQL, etc).
- **Add authentication:**  
  Integrate JWT or OAuth2 for protected routes.
- **Add more validation:**  
  Update validation schemas in `staff.routes.js` and `middleware/validation.js`.
- **Update OpenAPI spec:**  
  Edit [src/swagger.json](src/swagger.json) to document new endpoints and schemas.

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## License

MIT

---

**For any questions, issues, or feature requests, please open an issue or contact the maintainer.**

---