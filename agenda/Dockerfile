FROM node:13-alpine

WORKDIR /usr/src/app

COPY agenda/package.json ./
COPY agenda/yarn.lock ./

RUN yarn install

COPY agenda .

ENV NODE_ENV production
ENV PORT 80

EXPOSE 80

CMD node cli.js --dburi mongodb://$DB_USER:$DB_PASSWORD@$DB_HOST -p 80
