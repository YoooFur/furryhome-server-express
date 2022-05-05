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

// 引入中间件
const
    verifySession = require('../middlewares/session');

// 初始化路由
const router = express.Router();


router.get('/', (req, res) => {
    res.send('ok');
})

router.use('/', verifySession.generate);

router.get('/site/list', siteCtrl.getSiteList);

router.get('/site/search', siteCtrl.searchSites);

router.get('/site/like', siteCtrl.stats.like);

router.get('/site/view', siteCtrl.stats.view);

router.get('/site/:id', siteCtrl.getSiteById);

router.get('/site/cate/list', siteCtrl.getSiteCateList);

router.get('/site/cate/:id', siteCtrl.getSiteCateById);

module.exports = router;