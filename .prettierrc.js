// https://prettier.io/docs/en/options.html
module.exports = {
  printWidth: 180, // 换行字符串阈值
  semi: true, // 句末加分号
  singleQuote: true, // 用单引号
  trailingComma: 'es5', // 最后一个对象元素加逗号 对象尾随逗号 [arr, ] { obj, } none
  bracketSpacing: true, // 对象，数组加空格{ foo: bar }, false=> {foo:bar}
  jsxBracketSameLine: false, // jsx > 是否另起一行 <Test></Test>
  arrowParens: 'avoid', // 箭头函数是否省略括号 (x) => {} 是否要有小括号
  requirePragma: false, // 是否要注释来决定是否格式化代码
  proseWrap: 'preserve' // 是否要换行
}
