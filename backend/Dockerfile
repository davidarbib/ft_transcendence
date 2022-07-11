FROM node:alpine3.14

USER root
WORKDIR /app

COPY package*.json ./

RUN  apk add --update python3 py3-pip && npm install --force


COPY . .

EXPOSE 8090

CMD ["npm", "run", "start:dev"]
