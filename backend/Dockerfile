FROM node:20.18.0-alpine

WORKDIR /app

# Install build dependencies required for bcrypt
RUN apk add --no-cache make gcc g++ python3

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy backend source
COPY backend/ .

EXPOSE 5000

CMD ["npm", "start"]