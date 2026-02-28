# Foodipe

Never lose a recipe format again. Paste, extract, and auto-save recipes.

## Getting Started

This application has been fully dockerized for easy onboarding! You do not need Node.js installed locally.

### Prerequisites

1. Docker Desktop installed and running.
2. An OpenAI API Key (for the LLM recipe parser).

### Step 1: Configuration

In the root directory, there are two `frontend/` and `backend/` directories. Before starting, update your `.env` files.

1. Ensure `frontend/.env` exists and contains:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

2. Ensure `backend/.env` exists and contains:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://mongo:27017/foodipe
   JWT_SECRET=local_dev_secret_key_123
   OPENAI_API_KEY=YOUR_KEY_HERE
   ```
   *Replace `YOUR_KEY_HERE` with your actual OpenAI API key.*

### Step 2: Running the Stack

Open your terminal in the root directory and run:

```bash
docker compose up -d --build
```

### Accessing the applications
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **MongoDB**: `localhost:27017`

### Tearing Down

To stop the containers:
```bash
docker compose down
```

To stop containers and wipe the database:
```bash
docker compose down -v
```
