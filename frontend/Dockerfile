# Base image
FROM node:alpine3.20 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy application files
COPY . .

# build the application
RUN npm run build

# Use Nginx as web server
FROM nginx:alpine

# Copy Nginx custom configuration file 
COPY client_nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the application port (replace this port with client_port you received)
EXPOSE 3013

# Command to run the application
CMD ["nginx", "-g", "daemon off;"]