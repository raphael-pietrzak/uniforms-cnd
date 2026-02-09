FROM node:18

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des autres fichiers du projet
COPY . .

# Création du dossier uploads avec les bonnes permissions
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Exposition du port
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]
