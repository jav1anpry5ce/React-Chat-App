FROM node:alpine as builder

ARG REACT_APP_CHATAPP_API

ENV REACT_APP_CHATAPP_API $REACT_APP_CHATAPP_API

WORKDIR /app

COPY package.json .

RUN npm install -f


COPY . .

RUN npm run build


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

EXPOSE 80:80