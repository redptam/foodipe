FROM node:24-bullseye AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN export VITE_API_URL=/api && npm run build

FROM node:24-bullseye
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./public
EXPOSE 3000
CMD ["npm", "start"]
