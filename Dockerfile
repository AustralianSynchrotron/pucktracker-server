FROM node:carbon-alpine
RUN apk add --update --no-cache netcat-openbsd
WORKDIR /srv/app
COPY package.json yarn.lock ./
RUN yarn
COPY src ./src
COPY package.json yarn.lock index.js register.js config.example.js .babelrc docker-cmd ./
RUN cp config.example.js config.js
CMD ["./docker-cmd"]
