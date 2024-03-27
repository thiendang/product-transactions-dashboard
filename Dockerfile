# Use an official Node.js runtime as the base image
FROM node:14-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as the base image for serving the static files
FROM nginx:alpine

# Copy the built React app from the build stage to the Nginx public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 3000

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
