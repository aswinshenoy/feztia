#FROM node:alpine
#
#RUN apk add build-base zlib-dev autoconf automake nasm libtool libpng-dev jpeg-dev g++ gcc libgcc libstdc++ linux-headers make python3
#
#RUN mkdir /app
#
#COPY package.json /app
#COPY yarn.lock /app
#WORKDIR /app
#RUN yarn install
#
#COPY . /app
#RUN yarn build
#RUN cp ./.next/service-worker.js ./public
#
#EXPOSE 80
#CMD yarn start
FROM node:16-alpine

RUN apk add build-base zlib-dev autoconf automake nasm libtool libpng-dev jpeg-dev g++ gcc libgcc libstdc++ linux-headers make python3

COPY . .

RUN yarn install

RUN yarn run build
RUN cp ./.next/service-worker.js ./public
CMD [ "yarn", "start" ]