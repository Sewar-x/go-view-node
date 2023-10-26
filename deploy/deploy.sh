#!/bin/sh

# 检查当前目录是否为 Git 仓库
if [ ! -d .git ]; then
  echo "当前目录不是 Git 仓库"
  echo "正在初始化 Git 仓库..."
  git init
fi

# 设置远程仓库和拉取远程分支代码
remote="mygit"
branch="low-code-node"
remote_repository_url="https://gitee.com/jokerxw/low-code-node.git"


# 检查远程仓库是否已设置
if ! git remote | grep -q "$remote"; then
  echo "远程仓库未配置，配置远程仓库..."
  git remote add "$remote" "$remote_repository_url"
fi

# 拉取远程分支代码
echo "同步修改..."
git pull "$remote" "$branch"

echo "docker 构建镜像..."
nvm use 14.17.5
docker image build -t low-code-node .

echo "docker 保存镜像..."
docker save  low-code-node > ./package/lowcode.tar

echo "上传 docker 镜像..."
npm run deploy:prod

# 检查拉取是否成功
# if [ $? -eq 0 ]; then
#   echo "远程仓库同步成功."
#   pm2 restart low-code-node
# else
#   echo "远程仓库同步失败."
# fi