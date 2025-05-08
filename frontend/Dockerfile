# Stage 1: Build React app
FROM node:alpine as builder

WORKDIR /app

COPY package.json ./
RUN npm install -f

COPY . .

ARG REACT_APP_API_URI
ENV REACT_APP_API_URI=$REACT_APP_API_URI

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /app/build .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
