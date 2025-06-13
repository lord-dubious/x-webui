# Combined Deployment Guide

This project has been configured to run both the backend API and frontend web application from a single port for easier deployment.

## Architecture Changes

- **Before**: Separate backend (port 4000) and frontend (port 3000) applications
- **After**: Combined application with Express proxy to Next.js server (single port: 4000)
- **Removed**: All Docker-related files and configurations
- **How it works**: Express serves API routes and proxies all other requests to an internal Next.js server

## Quick Start

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Generate database schema**:
   ```bash
   pnpm run db:generate
   ```

3. **Build the combined application**:
   ```bash
   pnpm run build:combined
   ```

4. **Start the application**:
   ```bash
   pnpm run start
   ```

The application will be available at `http://localhost:4000` (or your configured PORT).

## Development

For development with hot reloading:

```bash
# Start the combined app in development mode
pnpm run dev:combined

# Or for backend development with nodemon
cd apps/http-server
pnpm run dev:watch
```

## Environment Configuration

Update your `.env` file based on `.env.example`:

```env
# Main application port
PORT=4000

# Database
DATABASE_URL="mongodb://localhost:27017"

# Since frontend and backend are on the same port, leave this empty for relative paths
NEXT_PUBLIC_DOMAIN=""

# Other configurations...
```

## Available Scripts

- `pnpm run start` - Start the combined production application
- `pnpm run build:combined` - Build both frontend and backend
- `pnpm run dev:combined` - Development mode
- `pnpm run start:website` - Start the marketing website (separate, port 3001)

## Project Structure

```
apps/
├── http-server/     # Express.js backend + proxy to Next.js
├── web/             # Next.js frontend (runs internally on port 3000)
└── website/         # Marketing website (separate, port 3001)
```

## How It Works

1. **Express Server** (port 4000): Handles API routes and starts internal Next.js server
2. **Next.js Server** (internal port 3000): Serves the frontend application
3. **Proxy**: Express proxies all non-API requests to the Next.js server
4. **Single Port**: Users only need to access port 4000 for both frontend and API

## API Endpoints

All API endpoints are available at `/api/v1/` on the same port as the frontend:

- `GET /api/v1/user/getuserdetail`
- `POST /api/v1/user/login`
- `POST /api/v1/user/logout`
- And more...

## Deployment Notes

1. The frontend is built as static files and served by the Express server
2. No separate frontend server is needed
3. All API calls use relative paths
4. CORS is configured for the same origin
5. Docker configurations have been removed for simpler deployment

## Troubleshooting

If you see "Please build the web application first", run:
```bash
pnpm run build:combined
```

If you encounter CORS issues, ensure `NEXT_PUBLIC_DOMAIN` is empty in your `.env` file.
