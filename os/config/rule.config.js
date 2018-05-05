// 接口规范配置参数
module.exports = function(n, data) {
    switch(n) {
        case 200:
        return {code: 200, msg: data.msg || '请求成功！', body: data.data || {info: '请求成功！'}};
        case 301:
        return {code: 301, msg: data.msg || '请求参数不完整，请查看接口文档！', body: {}};
        case 302:
        return {code: 302, msg: data.msg || '用户未登录，请先登录！', body: {}};
        case 303:
        return {code: 303, msg: data.msg || '数据库异常，请报告网站管理员！', body: {}};
        case 304:
        return {code: 304, msg: data.msg || '系统内部异常，请联系开发者！', body: {}};
        default:
        return {code: 404, msg: data.msg || '未知错误，危险！请立即远离电脑！', body: {}}
    }
}