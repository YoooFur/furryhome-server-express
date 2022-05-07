/**
 * Express /auth 路由
 * route/auth.js
 * 身份认证
 */

// 引入库
const express = require('express');

// 引入控制器
const
    githubCtrl = require('../controllers/auth/github');

// 初始化路由
const router = express.Router();

router.get('/', (req, res) => {

    if (!req.session.userInfo) {
        res.send({
            code: -401,
            msg: "未登录",
            data: {
                oauth: {
                    github: '/auth/oauth/github?redirectURI=/auth'
                }
            }
        })
        return;
    };

    res.send({
        code: 200,
        msg: `${req.session.userInfo.name}，欢迎访问 FurryHome`,
        data: req.session.userInfo
    });
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth');
})

// OAuth

// ============= GitHub =============

router.get('/oauth/github', githubCtrl.request);

router.get('/oauth/github/callback', githubCtrl.callback);


module.exports = router;