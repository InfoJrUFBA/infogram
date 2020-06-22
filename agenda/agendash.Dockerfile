FROM node:latest

RUN npm install -g agendash

EXPOSE 80
CMD agendash --db=mongodb://$DB_USER:$DB_PASSWORD@$DB_HOST --collection=agendaJobs --port=80
