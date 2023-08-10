FROM node:14.17.0
COPY . /app
WORKDIR /app
RUN npm install pm2@latest -g \
    && npm install --registry=https://registry.npm.taobao.org \
    && npm i cross-env \
    && npm i nodemon  
EXPOSE 3000
CMD pm2 start pm2.json