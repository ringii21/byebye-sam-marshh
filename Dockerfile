FROM node:20

WORKDIR /app

COPY backend/ ./
COPY frontend/ ./frontend/

RUN npm install express express-session

EXPOSE 3000

CMD ["node", "app.js"]

