// 引入vm模块
const vm = require('vm')

// 引入knex模块
const knex = require('knex')

// 引入其他需要的模块
const S7 = require('s7') // 假设这是一个设备交互的模块

// 定义一个函数，根据脚本类型创建不同的沙箱对象
function createSandbox(type) {
  // 创建一个基础的沙箱对象，包含公共功能
  const sandbox = {
    console: console,
    log: function (message) {
      // 模拟日志记录操作
      console.log('Logging:', message)
    },
    // 假设这是一个response对象，用于返回数据给调用者
    response: {
      data: null,
      status: null,
      send: function () {
        // 模拟发送响应的操作
        console.log('Sending response:', this.data, this.status)
      }
    }
  }

  // 根据类型添加不同的功能到沙箱对象中
  switch (type) {
    case 'database':
      // 如果是数据库交互类型，添加db功能到沙箱对象中
      sandbox.db = knex({
        client: 'mysql',
        connection: {
          host: '127.0.0.1',
          user: 'your_database_user',
          password: 'your_database_password',
          database: 'myapp_test'
        }
      })
      break

    case 'device':
      // 如果是设备交互类型，添加S7功能到沙箱对象中
      sandbox.S7 = S7 // 假设S7模块已经提供了相关的方法和属性

      break

    default:
    // 如果是其他类型，可以添加其他功能或者不做任何操作
  }

  // 返回创建好的沙箱对象
  return sandbox
}


// 创建一个预编译的脚本对象，传入用户输入的js代码
const script = new vm.Script(`
  // 使用沙箱对象中的console打印一条信息
  console.log('Hello from user script!');

  // 使用沙箱对象中的dbQuery方法执行一条SQL语句，并使用await关键字等待结果
  try {
    const result = await dbQuery('select * from users');
    // 将查询结果赋值给response.data，并设置响应状态为200（成功）
    response.data = result;
    response.status = 200;

    // 使用沙箱对象中的log记录一条日志信息
    log('User script executed successfully.');

    // 使用沙箱对象中的response.send发送响应给调用者
    response.send();

  } catch (error) {
     // 如果发生错误，将错误信息赋值给response.data，并设置响应状态为500（失败）
     response.data = error;
     response.status = 500;

     // 使用沙箱对象中的log记录一条日志信息
     log('User script executed with error.');

     // 使用沙箱对象中的response.send发送响应给调用者
     response.send();

   }
`);

// 调用createSandbox函数来创建数据库交互类型的沙箱对象，并使用vm.createContext方法创建一个上下文化的对象
const context = vm.createContext(createSandbox('database'));

// 使用script.runInContext方法在指定的上下文中执行预编译好的脚本
script.runInContext(context);