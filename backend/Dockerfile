FROM node:24-bullseye

WORKDIR /app

# For dev environment, we'll mount the code via volumes, 
# but it's good practice to install dependencies if package.json exists.
# We will use `npm install` and start the dev server via docker-compose command.

EXPOSE 3000

# Start script will be provided by docker-compose
CMD ["npm", "run", "dev"]
