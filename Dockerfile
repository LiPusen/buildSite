FROM docker.io/node:8
RUN npm install pm2 nrm -g && mkdir /app
WORKDIR /app
ONBUILD COPY ./package.json /app
ONBUILD RUN ["npm", "install"]
ONBUILD COPY . /app/
CMD ["npm", "start"]