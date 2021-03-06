/**
 * express.js
 * HTTP 服务入口
 */

// 引入库
const express = require('express');
const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const redis = require('./redis');

// 初始化
console.log("初始化 Express");

// 引入路由
const router = require('./routes');

// 配置文件
const config = require('./config.json').express;

let port;

if (config) {
    port = (config.port || 9393);
} else {
    port = 9393;
}


// 初始化 Express 实例
const app = express();

// 处理跨域
const allowCors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
app.use(allowCors);

// 使用数据处理中间件
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: config.secret,
    name: 'sid',
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: ".furryhome.cn"
    },
    store: redis.sessionStore
}))

// 调试输出
if (process.env.dev) {
    app.use(logger('dev'));
}

// 设置路由
app.use(router);

// 设置端口
console.log(`Epxress 运行于 ${port}`);
app.set('port', port);

// 创建 HTTP 服务实例
console.log("初始化 HTTP 服务");
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// 错误处理
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.log(bind + ' 需要提升权限');
            process.exit(1);
        case 'EADDRINUSE':
            console.log(bind + ' 端口已在使用中');
            process.exit(1);
        default:
            throw error;
    }
}

// 监听处理
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`HTTP 服务监听本地 ${bind}`);
}