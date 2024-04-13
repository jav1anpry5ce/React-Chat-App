FROM node:alpine as builder


WORKDIR /app

COPY package.json .

RUN npm install -f


COPY . .

RUN npm run build


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .

ENV REACT_APP_API_URI ""

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

EXPOSE 80:80