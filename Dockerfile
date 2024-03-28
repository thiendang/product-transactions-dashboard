# Build Front end Phase
FROM node:18-alpine as build
EXPOSE 80
WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# NGINX Phase
FROM nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 3000

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
