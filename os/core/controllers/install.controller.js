var async = require('async');
var logger = require('../../lib/logger.lib');
var database = require('../../lib/database.lib');
var themes = require('../../lib/themes.lib');
var installService = require('../services/install.service');
var rule = require('../../config/rule.config');

/**
 * 根据安装状态跳转前台页面
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.access = function (req, res, next) {
  installService.status(function (err, hasInstall) {
    if (err) {
      logger[err.type]().error(__filename, err);
      return res.status(200).json(rule(304, {msg: '读取文件异常，请查看相关代码！'}));
    }

    if (hasInstall) {
      next();
    } else {
      res.redirect('/install');
      // res.sendFile('index.html', { root: './public/install/' });
    }
  });
};

/**
 * 查询安装状态
 * @param {Object} req
 * @param {Object} res
 */
exports.status = function (req, res) {
  installService.status(function (err, hasInstall) {
    if (err) {
      logger[err.type]().error(__filename, err);
      return res.status(200).json(rule(304, {msg: '读取文件异常，请检查相关代码！'}));
    }

    if (hasInstall) {
      res.status(200).json({ hasInstall: true });
    } else {
      res.status(200).json({ hasInstall: false });
    }
  });
};

/**
 * 查询主题
 * @param {Object} req
 * @param {Object} res
 */
exports.themes = function (req, res) {
  themes.get(function (err, themes) {
    if (err) {
      logger[err.type]().error(__filename, err);
      return res.status(200).json(rule(304, {msg: '读取themes目录失败，请检查相关代码！'}));
    }

    res.status(200).json(rule(200, {data: themes}));
  });
};

/**
 * 测试数据库
 * @param {Object} req
 * 				{String} req.body.host
 * 				{Number} req.body.port
 * 				{String} req.body.db
 * 				{String} req.body.user
 * 				{String} req.body.password
 * @param {Function} res
 */
exports.db = function (req, res) {
  req.checkBody({
    'host': {
      notEmpty: {
        options: [true],
        errorMessage: '数据库地址不能为空'
      },
      matches: {
        options: [/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$|^localhost$/],
        errorMessage: '数据库地址格式不正确'
      }
    },
    'port': {
      notEmpty: {
        options: [true],
        errorMessage: '数据库端口号不能为空'
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: '数据库端口号需为整数'
      }
    },
    'db': {
      notEmpty: {
        options: [true],
        errorMessage: '数据库名称不能为空'
      },
      isString: { errorMessage: '数据库名称需为字符串' }
    },
    'user': {
      notEmpty: {
        options: [true],
        errorMessage: '数据库用户名不能为空'
      },
      isString: { errorMessage: '数据库用户名需为字符串' }
    },
    'pass': {
      notEmpty: {
        options: [true],
        errorMessage: '数据库密码不能为空'
      },
      isString: { errorMessage: '数据库密码需为字符串' }
    }
  });

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(200).json(rule(301, {msg: req.validationErrors()[0]['message']}));
  }

  var data = {
    host: req.body.host,
    port: req.body.port,
    db: req.body.db,
    user: req.body.user,
    pass: req.body.pass
  };

  async.series([
    // 检查安装状态
    function (callback) {
      installService.status(function (err, hasInstall) {
        if (err) return callback(err);

        if (hasInstall) {
          var err = {
            type: 'system',
            error: '出错了哦，mycms系统已成功安装'
          };
          return callback(err);
        }

        callback();
      });
    },
    // 测试数据库连接
    function (callback) {
      database.install(data, function (err) {
        if (err) return callback(err);

        callback();
      });
    }
  ], function (err) {
    if (err) {
      return res.status(200).json(rule(303, {msg: '数据库连接失败，请检查相关参数是否正确！'}));
    }

    res.status(200).json(rule(200, {msg: '数据库安装成功！', data: {info: '数据库安装成功！'}}));
  });
};

/**
 * 安装
 * @param {Object} req
 * 				{String} req.body.databaseHost
 * 				{Number} req.body.databasePort
 * 				{String} req.body.database
 * 				{String} req.body.databaseUser
 * 				{String} req.body.databasePassword
 * 				{String} req.body.theme
 * 				{String} req.body.title
 * 				{String} req.body.email
 * 				{String} req.body.nickname
 * 				{String} req.body.password
 * @param {Function} res
 */
exports.install = function (req, res) {
  req.checkBody({
    'theme': {
      notEmpty: {
        options: [true],
        errorMessage: '站点主题不能为空'
      },
      isString: { errorMessage: '站点主题需为字符串' }
    },
    'title': {
      notEmpty: {
        options: [true],
        errorMessage: '网站标题不能为空'
      },
      isString: { errorMessage: '网站标题需为字符串' }
    },
    'email': {
      notEmpty: {
        options: [true],
        errorMessage: '管理员Email不能为空'
      },
      matches: {
        options: [/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/],
        errorMessage: '管理员Email格式不正确'
      }
    },
    'nickname': {
      notEmpty: {
        options: [true],
        errorMessage: '管理员昵称不能为空'
      },
      isString: { errorMessage: '管理员昵称需为字符串' }
    },
    'password': {
      notEmpty: {
        options: [true],
        errorMessage: '管理员密码不能为空'
      },
      isLength: {
        options: [6],
        errorMessage: '管理员密码不能小于 6 位'
      }
    }
  });

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(200).json(rule(301, {msg: req.validationErrors()[0]['message']}));
  }

  var siteInfodata = {
    title: req.body.title,
    theme: req.body.theme
  };

  var userDate = {
    email: req.body.email,
    nickname: req.body.nickname,
    password: req.body.password
  };

  async.auto({
    status: function (callback) {
      installService.status(function (err, hasInstall) {
        if (err) return callback(err);

        if (hasInstall) {
          var err = {
            type: 'system',
            error: '建站系统已经安装'
          };
          return callback(err);
        }

        callback();
      });
    },
    install: ['status', function (callback) {
      installService.install({
        siteInfoDate: siteInfodata,
        userDate: userDate
      }, function (err, install) {
        if (err) return callback(err);

        callback(null, install);
      });
    }],
    initTheme: ['install', function (callback) {
      themes.init(req.app, callback);
    }]
  }, function (err) {
    if (err) {
      logger[err.type]().error(err);
      return res.status(200).json(rule(303, {msg: '数据库连接异常，请联系开发工程师！'}));
    }

    logger.system().info(__dirname, '系统安装成功！');

    res.status(200).json(rule(200, {data: {info: 'rabbit已为您成功安装系统！'}}));
  });
};
exports.html = function (req, res) { 
  res.sendFile('index.html', { root: './public/install' });
}