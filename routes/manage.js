/**
 * Express /manage 路由
 * route/manage.js
 */

// 引入库
const express = require('express');

// 引入身份验证中间件
const auth = require('../middlewares/auth');

// 引入控制器
const
    siteCtrl = require('../controllers/manage/site');
    // groupCtrl = require('../controllers/manage/group');

// 初始化路由
const router = express.Router();

router.use('/', auth.verify);

router.post('/site/cate/add', siteCtrl.addSiteCate);

router.post('/site/cate/update', siteCtrl.updateSiteCate);

router.post('/site/cate/delete', siteCtrl.deleteSiteCate);

router.post('/site/add', siteCtrl.addSite);

router.post('/site/update', siteCtrl.updateSite);

router.post('/site/delete', siteCtrl.deleteSite);


module.exports = router;