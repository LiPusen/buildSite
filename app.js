var path = require('path');
var express = require('express');
// 服务端压缩插件，以压缩包的形式将文件发送给前端，前端接收后解压运行
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 请求参数校验中间件
var validator = require('./lib/validator.lib');
// 用户认证中间件
var session = require('./lib/session.lib');
// 系统日志中间件
var logger = require('./lib/logger.lib');
// 路由映射中间件，包括所有的页面请求和接口请求
var router = require('./lib/route-map.lib');
// 全局错误处理中间件
var errors = require('./core/controllers/errors.controller').error;

var app = express();

/**
 * 设置模板解析
 */
app.set('view engine', '.hbs');

/**
 * 中间件
 */
app.use(compression());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger.access());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session.check(), session.init());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 转给 Router 处理路由
 */
app.use(router);

/**
 * 错误处理程序
 */
app.use(errors);

/**
 * 导出 APP
 */
module.exports = app;