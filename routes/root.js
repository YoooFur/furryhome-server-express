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
    res.send({
        code: 200,
        msg: "欢迎访问 FurryHome 福瑞之家",
        data: {
            index: "https://furryhome.cn",
            document: "https://doc.furryhome.cn",
            github: "https://github.com/YoooFur/furryhome-server-express"
        },
        link: {
            YoooFur: "https://yooofur.com",
            FurDevsCN: "https://furdevs.cn",
        },
        FurryHome: 'beta-0.1.0510'
    })
})

router.use('/', verifySession.generate);

router.get('/favicon.ico', (req, res) => {
    res.redirect('https://fur233.oss-cn-hangzhou.aliyuncs.com/common/furryhome_white.png');
})

router.get('/site/list', siteCtrl.getSiteList);

router.get('/site/search', siteCtrl.searchSites);

router.get('/site/like', siteCtrl.stats.like);

router.get('/site/view', siteCtrl.stats.view);

router.get('/site/:id', siteCtrl.getSiteById);

router.get('/site/cate/list', siteCtrl.getSiteCateList);

router.get('/site/cate/:id', siteCtrl.getSiteCateById);

module.exports = router;