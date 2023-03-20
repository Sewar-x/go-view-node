<!-- [TOC] -->

## 项目介绍：
本项目是一个用nodejs实现的 go-view的后端，方便大家使用<br />
**除此之外，nodejs的后端还提供了，api功能，只要在数据库中配置sql，就能满足日常配置大屏和报表的需求。**
>go-view [代码仓库](https://gitee.com/dromara/go-view)

### 主要技术栈：
| 名称                | 版本    |
| ------------------- | ------ |
| express             | 4.18.2 |
| mysql2              | 3.1.0  |
| sequelize           | 6.28.0 |
| 详见 `package.json`  | 😁     |

### 使用方式
#### 安装
```shell
npm install
```
#### 启动
```shell
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
### 数据库脚本参考[db/mysql.sql](db/mysql.sql)

### 配置信息在[config](src/config/index.js)文件中定义
数据库连接配置：
```javascript
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

### 业务API配置，在数据库表api中定义
**以下sql中@line@，为api调用时需要传递的参数，在后端程序会自动根据@line@替换成对应的值。**
报表配置-不分页：
```sql
SELECT * FROM	bm_ipinfo WHERE	plineno = '@line@' AND station='@station@';
```

报表配置-分页：
```sql
SELECT COUNT(*) AS total FROM bm_ipinfo WHERE plineno = '@line@' AND station='@station@';
SELECT * FROM bm_ipinfo WHERE plineno = '@line@' AND station='@station@' LIMIT @offset@,@rows@;
```
支持跨数据库的配置方式，从而满足一套配置，切换不同数据库的需求：
具体语法参考：[knex](https://www.knexjs.cn/)
```javascript
knex('pms_plan')
  .select()
  .where({ company_id: '@company_id@', plant_id: '@plant_id@', line: '@line@' })
  .whereBetween('created_at', [moment('@GTD@').format('YYYY-MM-DDTHH:mm:ssZ'), moment('@LTD@').format('YYYY-MM-DDTHH:mm:ssZ')])
  .where(qb => {
    if ('@model@') qb.where('model', '@model@')
    if ('@sn@') qb.where('sn', 'like', `%@sn@%`)
  })
  .orderBy([ { column: 'plan_date' }, { column: 'list_order', order: 'asc' } ])
  .paginate({ perPage: @rows@, currentPage: @page@ })
```

### 业务API测试（vscode，推荐使用Thunder Client工具）
调用的url和参数：
所有api的url的访问都是通过 http:127.0.0.1:4444/api/getDataByApiId进行，通过参数中的apiId进行识别。以下演示了post的参数，get访问也可以只是测试时参数传递不同而已
分页的参数传递
```javascript
{
  "restype":"datagrid",
  "apiId": "021ea7a0-d878-11ea-a6ca-35634091a02b",
  "line": "H",
  "station":"6",
  "page":1,
  "rows":10
}
```
不分页的参数传递
```javascript
{
  "apiId": "021ea7a0-d878-11ea-a6ca-35634091a02b",
  "line": "H",
  "station":"6"
}
```

参数解释：
```javascript
"restype":"前端需要的数据格式，不同的前端所要求的返回格式不同（一般情况：不分页-不需要此字段；分页-datagrid即可）",
"apiId":"数据库api表中id字段，用于标识调用哪个脚本进行返回",
"line、station": "sql语句、存储过程、knex脚本中所需要的变量",
"page":"第几页",
"rows":"页大小"
```

### 集成过程中的注意事项
具体内容见：[地址](https://www.cnblogs.com/egreen/p/17075035.html)