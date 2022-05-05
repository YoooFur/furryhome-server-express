/**
 * redis.js
 * session 预持久化存储
 */

// 引入库
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

// 引入配置文件
const {host, port, pwd} = require('./config.json').redis;

// 连接Redis
console.log("初始化 Redis 连接");

const client = redis.createClient({
    socket: {
        host,
        port
    },
    password: pwd,
    legacyMode: true
})

function connect () {
    return new Promise (async (resolve, reject) => {
        
        client.connect();
        
        client.on('ready', async(e) => {
            console.log('Redis 连接成功')
            resolve();
        })
        
        client.on('error', async(err) => {
            console.error(err);
            resolve();
        })

    })

}


const sessionStore = new RedisStore({
    client
})

// 导出
module.exports = {
    sessionStore,
    connect,
    client
};