## 技术栈

| 技术     | 技术栈                 | 作用                                                         |
| -------- | ---------------------- | ------------------------------------------------------------ |
| 开发语言 | Node.js                |                                                              |
|          |                        |                                                              |
| 框架     | express 4.x            |                                                              |
|          |                        |                                                              |
|          | express.static         | 静态文件服务                                                 |
| 中间件   | body-parser            | 解析 HTTP 请求的请求体                                       |
|          | cookie-parse           | 解析 HTTP 请求中的 cookie                                    |
|          | log4js                 | 日志管理模块                                                 |
|          |                        |                                                              |
| 插件     | pathParse.js（自定义） | 获取文件夹路径下所有文件对象挂载到 app 实例对象              |
|          | token.js               |                                                              |
|          |                        |                                                              |
| 数据库   | Sequelize              | Node.js [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) |



## docker 
### 构建 doker 镜像
* 构建 docker 镜像: `docker image build -t low-code-node .`
* 构建容器： ` docker container run -d -p 9991:9991 -it low-code-node /bin/bash `

## CI/CD自动化部署
* 目标： 通过 git 推送指定分支代码到 gitee 仓库后，gitee 通过 wehook 推送到程序中，然后服务拉取最新代码，并重新启动服务