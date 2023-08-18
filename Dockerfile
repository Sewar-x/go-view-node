# 使用多阶段构建（multi-stage build）的方法，将构建和生产环境分开

# 第一阶段（builder）中，只复制 package.json 和 package-lock.json 并安装生产依赖，以减少构建产物的大小
# 在第一阶段（builder）中安装生产依赖，以保证构建产物的轻量化
FROM node:14.17.0 as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --registry=https://registry.npm.taobao.org --production
 
# 在第二阶段中，只复制构建产物和运行时所需的依赖,使用更轻量级的 Node 镜像，例如 node:14.17.0-alpine。Alpine 镜像基于 Alpine Linux，体积更小
# 在第二阶段中只复制已安装的生产依赖，避免复制整个 node_modules 目录
# 将 COPY . . 命令移动到最后，以减少构建产物的大小。这样，只有必要的文件和目录会被复制到镜像中
# 将全局安装的依赖（pm2、cross-env、nodemon）移动到第二阶段中，并逐个安装，以确保只安装所需的依赖
FROM node:14.17.0-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache git
COPY --from=builder /app/node_modules /app/node_modules
COPY . .
RUN npm install pm2 -g && npm i cross-env && npm i nodemon
VOLUME ["/low-code-node-app"]
EXPOSE 9991
CMD npm run pm2:prod