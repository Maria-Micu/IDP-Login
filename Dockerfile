FROM node:stretch-slim

WORKDIR /usr/login

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY *.json ./
COPY *.js ./

RUN npm install
EXPOSE 5001

CMD ["node", "login.js"]