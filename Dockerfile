FROM node:14.17.0
COPY . /app
ENV NODE_ENV=production
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org \
    && npm install pm2 -g \
    && npm i cross-env \
    && npm i nodemon 
VOLUME ["/low-code-node-app"] 
EXPOSE 9991
CMD npm run pm2:prod