# Stage 1: Build
FROM node:16-alpine AS build
WORKDIR /app

# Salin file package.json dan package-lock.json/yarn.lock terlebih dahulu
COPY package*.json ./
RUN npm install

# Salin seluruh source code dan jalankan build
COPY . .
RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:alpine
# Salin hasil build ke folder default Nginx (lokasi file statis)
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]