const express = require('express');
const router = express.Router();
const { date_fmt } = require('../utils/datetime_kit');

router.get('/debug', function (req, res, next) {
  res.send(`<html>
<head>
<title>LedWebApi</title>
</head>

<body>
    <p>Welcome, to the LedWebApi.</p>
    <p>Now: ${date_fmt()}</p>
    <script type="text/javascript">
      // ==================http================================================
      var http = {};
      http.quest = function (option, callback) {
        var url = option.url;
        var method = option.method;
        var data = option.data;
        var timeout = option.timeout || 0;
        var xhr = new XMLHttpRequest();
        (timeout > 0) && (xhr.timeout = timeout);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
              var result = xhr.responseText;
              try { result = JSON.parse(xhr.responseText); } catch (e) { }
              callback && callback(null, result);
            } else {
              callback && callback('status: ' + xhr.status);
            }
          }
        }.bind(this);
        xhr.open(method, url, true);
        if (typeof data === 'object') {
          try {
            data = JSON.stringify(data);
          } catch (e) { }
        }
        xhr.send(data);
        xhr.ontimeout = function () {
          callback && callback('timeout');
          console.log('%c连%c接%c超%c时', 'color:red', 'color:orange', 'color:purple', 'color:green');
        };
      };
      http.get = function (url, callback) {
        var option = url.url ? url : { url: url };
        option.method = 'get';
        this.quest(option, callback);
      };
      http.post = function (option, callback) {
        option.method = 'post';
        this.quest(option, callback);
      };

      ////普通get请求
      //http.get('http://www.baidu.com', function (err, result) {
      //    // 这里对结果进行处理
      //});

      ////定义超时时间(单位毫秒)
      //http.get({ url: 'http://www.baidu.com', timeout: 1000 }, function (err, result) {
      //    // 这里对结果进行处理
      //});

      ////post请求
      //http.post({ url: 'http://www.baidu.com', data: '123', timeout: 1000 }, function (err, result) {
      //    // 这里对结果进行处理
      //});
    </script>
</body>
</html>`);
});

module.exports = router;
