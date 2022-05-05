/**
 * 退出前释放
 */

const redis = require('./redis').client;
const mongoose = require('./mongo').mongoose;

process.on('SIGINT', async () => {
    console.log("正在断开 Redis 连接");
    await redis.disconnect();
    console.log("正在断开 mongoDB 连接");
    await mongoose.disconnect();
    process.exit();
});