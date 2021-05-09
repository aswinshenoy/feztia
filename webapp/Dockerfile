FROM node:alpine

RUN apk add build-base zlib-dev autoconf automake nasm libtool libpng-dev jpeg-dev g++ gcc libgcc libstdc++ linux-headers make python3

COPY . .

RUN yarn install

RUN yarn run build
RUN cp ./.next/service-worker.js ./public
CMD [ "npm", "start" ]
