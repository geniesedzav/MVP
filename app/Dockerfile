# app/Dockerfile
FROM node:18

WORKDIR /workspace/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev"]