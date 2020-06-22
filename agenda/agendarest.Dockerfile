FROM node:latest

RUN npm install -g agenda-rest

EXPOSE 80
CMD agenda-rest --dburi mongodb://$DB_USER:$DB_PASSWORD@$DB_HOST -p 80
