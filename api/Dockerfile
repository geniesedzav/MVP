# api/Dockerfile
FROM node:20

WORKDIR /workspace/api

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["tail", "-f", "/dev/null"]