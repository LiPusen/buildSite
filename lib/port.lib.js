var _ = require('lodash');

/**
 * 格式化端口
 */
module.exports = function () {
  var PORT = false;

  var portIndex = _.findIndex(process.argv, function (arg) {
    return arg === '--port' || arg === '-p';
  });

  if (portIndex !== -1 && _.isNumber(parseInt(process.argv[portIndex + 1], 10))) {
    PORT = process.argv[portIndex + 1];
  }

  var val = PORT || process.env.PORT || '3008';
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * 获取环境变量里的端口参数，并格式化，默认端口是3008
 */