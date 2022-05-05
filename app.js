/**
 * FurryHome 福瑞之家导航 Server-Side App
 * Express & Mongo & Redis Ver.
 * Author: 玖叁 @colour93 (https://github.com/colour93)
 * 
 *      ______                      __  __                   
 *     / ____/_  ______________  __/ / / /___  ____ ___  ___ 
 *    / /_  / / / / ___/ ___/ / / / /_/ / __ \/ __ `__ \/ _ \
 *   / __/ / /_/ / /  / /  / /_/ / __  / /_/ / / / / / /  __/
 *  /_/    \__,_/_/  /_/   \__, /_/ /_/\____/_/ /_/ /_/\___/ 
 *                       /____/       
 * 
 */

// 加载预处理
require('./preload');

// 初始化
init();

async function init () {

    // 先初始化redis
    const redis = require('./redis');
    await redis.connect();

    // 继而初始化mongo
    const mongo = require('./mongo');
    await mongo.connect();

    // 最后初始化express
    const express = require('./express');

    // 挂载退出监控
    require('./exit');
}

