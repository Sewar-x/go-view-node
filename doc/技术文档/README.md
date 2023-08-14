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
* 使用卷：
    * 使用docker volume create命令创建卷：` docker volume create low-code-node ` (low-code-node 应用程序将其数据存储在 /temp 容器文件系统)
    * 启动 low-code-node 应用程序容器，但添加--mount指定卷安装的选项。为卷命名，并将其安装到 /temp 容器中，该容器捕获在该路径中创建的所有文件。在 Mac 或 Linux 终端中，或者在 Windows 命令提示符或 PowerShell 中，运行以下命令：` docker run -dp 9991:9991 --mount type=volume,src=low-code-node,target=/temp  low-code-node ` ( 该-d标志（ 的缩写--detach）在后台运行容器。该-p标志（ 的缩写--publish）在主机和容器之间创建端口映射。该-p标志采用 格式的字符串值HOST:CONTAINER，其中HOST是主机上的地址，CONTAINER是容器上的端口。该命令将容器的端口 9991 发布到主机上的127.0.0.1:9991( )。localhost:9991 如果没有端口映射，您将无法从主机访问应用程序。)
* 绑定安装来运行开发容器：
    `docker run -dp 9991:9991 -w /app --mount type=bind,src=$pwd,target=/app low-code-node`
    * -dp 9991:9991 和之前一样。以分离（后台）模式运行并创建端口映射
    * -w /app- 设置“工作目录”或命令将从中运行的当前目录
    * --mount "type=bind,src=$pwd,target=/app"- 将当前目录从主机绑定挂载到/app容器中的目录

## CI/CD自动化部署
* 目标： 通过 git 推送指定分支代码到 gitee 仓库后，gitee 通过 wehook 推送到程序中，然后服务拉取最新代码，并重新启动服务