# API Serverless Functions

This directory contains Vercel serverless functions that handle API requests for the AzubiApp.

## Endpoints

### GET /api/get-table
Returns the task completion data from the CSV file.

**Response:**
```json
{
  "headers": ["Kürzel", "Aufgabe", "Erledigt", "Datum", "Uhrzeit"],
  "rows": [
    ["AB", "Aufgabe 1", "Ja", "11.2.2026", "18:23:25"],
    ...
  ]
}
```

### POST /api/save-task
Saves a completed task to the CSV file.

**Request Body:**
```json
{
  "user": "AB",
  "task": "Aufgabe 1",
  "completed": true,
  "date": "11.2.2026",
  "time": "18:23:25"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task erfolgreich gespeichert"
}
```

## Development

### Local Development
For local development, you can use the Express server in `server.js` which provides the same API endpoints:

```bash
npm install
npm start
```

### Vercel Deployment

**Important Note:** Vercel serverless functions have a read-only filesystem (except `/tmp` directory). This means:

- ✅ **GET /api/get-table** - Works perfectly, reads CSV from deployment
- ⚠️ **POST /api/save-task** - Will NOT persist data on Vercel

For production use on Vercel with persistent data storage, consider:
1. Using a database (PostgreSQL, MongoDB, etc.)
2. Using cloud storage (Vercel KV, S3, etc.)
3. Using a headless CMS or API service

The current implementation works great for local development and demonstrations.
