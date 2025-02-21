FROM node:20.18.0-alpine

WORKDIR /app

# Copy package files
COPY frontendblog/package*.json ./

# Install dependencies including dev dependencies
RUN npm install

# Copy frontend source
COPY frontendblog/ .

# Add this to ensure Vite is available globally if needed
RUN npm install -g vite

EXPOSE 5173

# Use double hyphens for host flag
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]