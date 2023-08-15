#!/bin/sh

# 检查当前目录是否为 Git 仓库
if [ ! -d .git ]; then
  echo "当前目录不是 Git 仓库"
  echo "正在初始化 Git 仓库..."
  git init
fi

# 设置远程仓库和拉取远程分支代码
remote="origin"
branch="low-code-node"
remote_repository_url="http://szmoka.tclking.com:8081/xuwen/low-code-node.git"


# 检查远程仓库是否已设置
if ! git remote | grep -q "$remote"; then
  echo "远程仓库未配置，配置远程仓库..."
  git remote add "$remote" "$remote_repository_url"
fi

# 拉取远程分支代码
echo "同步修改..."
git pull "$remote" "$branch"

# 检查拉取是否成功
if [ $? -eq 0 ]; then
  echo "远程仓库同步成功."
else
  echo "远程仓库同步失败."
fi