# Staffing API

A RESTful API for managing staff records, built with Node.js and Express.

## Features

- CRUD operations for staff members
- Input validation
- Error handling
- Pagination
- Health check endpoint
- CORS enabled
- Security headers with Helmet
- Request logging with Morgan

## API Endpoints

- `POST /staff` - Create a new staff member
- `GET /staff` - List all staff members (with pagination)
- `GET /staff/:id` - Get a specific staff member
- `PUT /staff/:id` - Update a staff member
- `DELETE /staff/:id` - Delete a staff member

## Development

1. Clone the repository:
```bash
git clone <repository-url>
cd staffing-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run tests:
```bash
npm test
```

## Deployment

This API is configured for deployment on Render.com. The deployment is automated through the `render.yaml` file.

### Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Port number (default: 3000)

### Health Check

The API includes a health check endpoint at `/` that returns:
```json
{
  "status": "ok",
  "message": "Staffing API is running"
}
```

## API Client

A JavaScript client SDK is available for interacting with this API. See the `src/client` directory for implementation details.

## License

MIT 