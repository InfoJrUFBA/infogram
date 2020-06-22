FROM node:14-alpine

WORKDIR /usr/src/app

COPY server/package.json ./
COPY server/yarn.lock ./

RUN yarn install

COPY server .

ENV NODE_ENV production
ENV PORT 80

EXPOSE 80

CMD [ "yarn", "start" ]
