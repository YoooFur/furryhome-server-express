/**
 * Express 根路由
 * route/index.js
 */

// 引入库
const express = require('express');

// 引入下级路由
const 
    rootRouter = require('./root'),
    manageRouter = require('./manage'),
    authRouter = require('./auth');

// 初始化路由
const router = express.Router();

router.use('/', rootRouter);

router.use('/auth', authRouter);

router.use('/manage', manageRouter);

module.exports = router;