FROM --platform=linux/amd64 node:latest AS build
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM --platform=linux/amd64 nginx:latest AS deploy
WORKDIR usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/public . 
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
