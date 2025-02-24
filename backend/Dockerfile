FROM node:20.18.0

WORKDIR /app

# Install required build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files first (use Docker cache)
COPY backend/package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of your backend code
COPY backend/ .

EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
