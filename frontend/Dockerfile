# Étape de build
FROM node:18-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des fichiers source
COPY . .

# Build de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:stable-alpine

# Copie de la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers de build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Exposition du port
EXPOSE 5173

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
