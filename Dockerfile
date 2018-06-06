FROM node:10-slim

WORKDIR /root/service

COPY package.json /root/service/
RUN npm install

COPY . /root/service/

CMD [ "npm", "run", "start" ]
