# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source and itineraries
COPY . .

# Generate data from itinery/ directory and build static site
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Standard HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
