FROM node:17-buster-slim

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

# RUN groupadd -r front && useradd -r -g front frontDev

RUN apt update -y && apt upgrade -y \
    && apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev -y \
    && apt install python3 -y \
    && npm install
# && chown -R frontDev .

COPY . .

EXPOSE 8000

# USER frontDev

CMD chmod 777 node_modules \
    && npm run dev
# CMD ["npm", "run", "dev"]
