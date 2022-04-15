FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json .

RUN npm install --silent

COPY . .

EXPOSE 3030

CMD ["npm", "run", "dev"]
# for production build
#CMD ["npm", "run", "build"]