## 本项目是一个用nodejs实现的 go-view的后端，方便大家使用

### 使用方式
#### 安装
```
npm install
```
#### 启动
```
npm start
```

### 项目结构
```
.
├── README.en.md
├── README.md
├── db
│   └── mysql.sql   针对mysql数据需要的表结构
├── package.json    package文件
├── server.js       服务启动文件
├── src
│   ├── config      配置文件
│   ├── controllers 控制器
│   ├── models      model层
│   ├── routers     路由
│   ├── services    数据库操作
│   └── utils       工具类
└── tmp             文件上传临时目录
    └── upload/tmp
```

### 配置信息在config文件中
```
数据库连接配置：

sequelizeConfig: {
    username: 'root',
    password: 'mes',
    database: 'smt',
    connect: {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
      dialectOptions: {
        multipleStatements: true,
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true,
        decimalNumbers: true
      },
      timezone: '+08:00',
      define: {
        charset: 'utf8mb4',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: false, //开启假删除
        // 定义全局的钩子
        hooks: {}
      },
      pool: {
        max: 5, // 连接池最大链接数量
        min: 0, // 最小连接数量
        acquire: 30000, //建立连接最长时间
        idle: 10000 //空闲最长连接时间
      }
    }
```