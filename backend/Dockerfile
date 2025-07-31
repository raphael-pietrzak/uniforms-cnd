FROM node:18

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des autres fichiers du projet
COPY . .

# Exposition du port (à adapter selon votre configuration)
EXPOSE $PORT

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]
