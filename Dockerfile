FROM node:stretch-slim

WORKDIR /usr/login

COPY *.js ./

RUN npm install
EXPOSE 5001

CMD ["node", "login.js"]