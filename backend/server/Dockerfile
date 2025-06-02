FROM node:alpine3.20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose the application port (replace it with the server_port you received)
EXPOSE 3014

# Command to run the application
CMD ["npm", "start"]