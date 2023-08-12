FROM node:alpine

WORKDIR /server

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD [ "npm", "start" ]