FROM node:20

WORKDIR /app

COPY backend/ ./
COPY frontend/ ./frontend/

RUN npm install express express-session

EXPOSE 3000

CMD ["node", "app.js"]

FROM node:20

WORKDIR /app

# Copier le backend
COPY backend/ ./backend/

# Copier le frontend
COPY frontend/ ./frontend/

# Copier et générer un package.json minimal (ou ajoute le tien si tu en as un)
COPY package.json ./

# Installer les dépendances
RUN npm install

# Exposer le port (Render l’utilise via process.env.PORT)
EXPOSE 3000

# Lancer le serveur
CMD ["node", "backend/app.js"]
