FROM node:5.7

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --production

RUN mkdir /usr/src/app/db.up

COPY . /usr/src/app/

ENV PORT 3100
EXPOSE ${PORT}

CMD ["npm", "start"]
