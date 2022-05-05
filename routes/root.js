/**
 * Express / 路由
 * route/root.js
 */

// 引入库
const express = require('express');

// 引入控制器
const
    siteCtrl = require('../controllers/site');
    // groupCtrl = require('../controllers/group');

// 初始化路由
const router = express.Router();


router.get('/', (req, res) => {
    res.send('ok');
})

router.get('/site/list', siteCtrl.getSiteList);


module.exports = router;