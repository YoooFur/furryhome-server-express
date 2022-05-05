/**
 * Express /manage 路由
 * route/manage.js
 */

// 引入库
const express = require('express');

// 引入控制器
const
    siteCtrl = require('../controllers/manage/site');
    // groupCtrl = require('../controllers/manage/group');

// 初始化路由
const router = express.Router();


// router.get('/site', siteCtrl.getSiteList)


module.exports = router;