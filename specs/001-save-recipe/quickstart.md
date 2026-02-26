# Quickstart: Save Recipe

This feature requires Docker and Docker Compose to be installed on your system, as well as an OpenAI API key for parsing.

## 1. Environment Variables

Create `.env` files in both the `backend/` and `frontend/` directories.

**`backend/.env`**:
```env
# Server Port (Mapped from container)
PORT=3000

# MongoDB Connection String (Resolves to the compose service 'mongo')
MONGODB_URI=mongodb://mongo:27017/foodipe

# OpenAI API Key for parsing recipe text
OPENAI_API_KEY=sk-...

# JWT or Auth Provider Secret (if using custom auth)
AUTH_SECRET=your_auth_secret_here
```

**`frontend/.env`**:
```env
# URL for the backend API
# When running locally in browser, it hits localhost which Docker forwards to the backend container
VITE_API_URL=http://localhost:3000/api
```

## 2. Running the Application

From the root directory (`foodipe/`), use docker compose to build and start the entire stack (Frontend, Backend, and MongoDB Database):

```bash
docker compose up --build
```

- The React app will be available at `http://localhost:5173`
- The API will be available at `http://localhost:3000`
- MongoDB will be running and exposed on `localhost:27017`
