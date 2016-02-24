FROM node:5.7

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN mkdir /usr/src/app/db.up

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app/

EXPOSE 3000

CMD ["npm", "start"]
