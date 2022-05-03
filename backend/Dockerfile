FROM node:alpine3.14

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

EXPOSE 8090

CMD ["npm", "run", "start:dev"]