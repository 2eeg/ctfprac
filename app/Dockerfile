FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npx", "nodemon", "-L", "--verbose", "./src/app.js"]

EXPOSE 3000