FROM node:17-buster-slim

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json .

RUN groupadd -r front && useradd -r -g front frontDev

RUN npm install --silent \
&& chown -R frontDev .

COPY . .

EXPOSE 8000

USER frontDev

CMD ["npm", "run", "dev"]
