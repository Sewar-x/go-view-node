module.exports = {
  //apps是个数组，里面可以存放多个node应用实例的配置
  apps: [{
    name: "low-code-node",        //指定node应用的名称
    script: "./src/server.js", //指定node应用的入口文件
    exec_mode: 'fork',      //开启cluster集群模式
    instances: 1,            //根据cpu可用核数运行最大数量的node应用实例
    watch: true,                //开启监听模式，任意文件内容发生改变，都会重启node应用
    ignore_watch: ["node_modules", "logs", "tmp", "package", "doc", "db"],     //监听模式下，忽略的文件列表
    env: {                     //默认的环境变量
      NODE_ENV: "production",
      MODE: "default"
    },
    env_production: {          //生产环境变量，需要在命令行中添加参数 --env prod
      NODE_ENV: "production",
      MODE: "production"
    },
    env_test: {         //测试环境变量，需要在命令行中添加参数 --env test
      NODE_ENV: "test",
      MODE: "test"
    }
  }],
  //部署相关的配置
  deploy: {
    //生产环境的部署，部署的方式以deploy的key作为区分
    production: {
      key: "", // 指定 SSH 密钥,带有公钥路径的“key”属性
      user: 'root', // 权限验证用户名                                                       
      host: 'http://10.126.16.116', //服务器ip地址
      ref: '', //需要拉取的仓库分支
      repo: '', //仓库地址
      path: '', //需要发布到服务器的路径
      'pre-setup': '', //在安装进程启动之前需要执行的命令,可以用于拉取最新代码
      'post-setup': "npm install && pm2 start ecosystem.config.js --env production", //拉取代码之后需要执行的指令
      'pre-deploy': '', //部署之前的钩子，暂不清楚与'post-deploy'的区别，共同点是都可以进行reload的操作
      'post-deploy': 'pm2 reload ecosystem.config.js --env production'
    },
    //测试环境的部署，部署的方式以deploy的key作为区分
    test: {
      key: "", // 指定 SSH 密钥,带有公钥路径的“key”属性
      user: 'root', //服务器用户名  
      host: '',//服务器ip地址
      ref: '',//需要拉取的仓库分支
      repo: '', //仓库地址
      path: '',//需要发布到服务器的路径
      'pre-setup': '', //在安装进程启动之前需要执行的命令
      'post-setup': "npm install && pm2 start ecosystem.config.js --env test",
      'pre-deploy': '',
      'post-deploy': 'pm2 reload ecosystem.config.js --env test'
    }
  }
}
