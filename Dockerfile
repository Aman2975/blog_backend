FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

COPY prisma ./prisma
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "node dist/server.js"]