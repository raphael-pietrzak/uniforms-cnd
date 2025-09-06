# DevContainer pour CND Uniformes

Ce devcontainer configure automatiquement un environnement de développement complet pour le projet CND Uniformes avec Docker.

## Prérequis

- Docker Desktop installé et en cours d'exécution
- Visual Studio Code avec l'extension "Dev Containers" installée

## Utilisation

1. Ouvrez le projet dans VS Code
2. Appuyez sur `Ctrl+Shift+P` (ou `Cmd+Shift+P` sur Mac)
3. Tapez "Dev Containers: Reopen in Container"
4. Sélectionnez cette option et attendez que le container se construise

## Ce qui est configuré automatiquement

### Services
- **Backend** (Node.js + Express) sur le port 3000
- **Frontend** (React + Vite + TypeScript) sur le port 5173
- Base de données SQLite intégrée

### Extensions VS Code incluses
- TypeScript et JavaScript
- Tailwind CSS IntelliSense
- Prettier (formatage automatique)
- ESLint
- Auto Rename Tag
- Path Intellisense
- Docker

### Commandes automatiques
- Installation des dépendances npm pour frontend et backend
- Migration de la base de données
- Seeding des données initiales

## Commandes utiles

Dans le terminal intégré de VS Code :

```bash
# Démarrer le backend en mode développement
cd backend && npm run dev

# Démarrer le frontend en mode développement  
cd frontend && npm run dev

# Relancer les migrations
cd backend && npm run migrate

# Relancer le seeding
cd backend && npm run seed
```

## Ports

- Frontend : http://localhost:5173
- Backend API : http://localhost:3000

Les ports sont automatiquement forwardés et le frontend s'ouvrira automatiquement dans votre navigateur.