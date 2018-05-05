// 跨域设置
module.exports = function() {
    return function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

        if(req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next()
        }
    }
}