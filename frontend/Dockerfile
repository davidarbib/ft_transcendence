FROM node:17-buster-slim

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json .

RUN npm install --silent

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
