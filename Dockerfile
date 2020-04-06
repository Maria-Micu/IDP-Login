FROM node:stretch-slim

WORKDIR /usr/login

COPY *.json ./
COPY *.js ./

RUN npm install
EXPOSE 5001

CMD ["node", "login.js"]