FROM node:alpine

RUN apk add build-base zlib-dev autoconf automake nasm libtool libpng-dev jpeg-dev g++ gcc libgcc libstdc++ linux-headers make python3

RUN mkdir /app

COPY package.json /app
COPY yarn.lock /app
WORKDIR /app
RUN yarn install

COPY . /app
RUN yarn build
RUN cp ./.next/service-worker.js ./public

EXPOSE 80
CMD yarn start
