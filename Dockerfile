# Base image
FROM node:20.19.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose ports
EXPOSE 5001

# Default command (for production)
CMD [ "node", "src/index.js" ]
