FROM node:18-alpine

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des autres fichiers du projet
COPY . .

# Ajout du script de démarrage
COPY start.sh .
RUN chmod +x start.sh

# Exposition du port (à adapter selon votre configuration)
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["./start.sh"]
