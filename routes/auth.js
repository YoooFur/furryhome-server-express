/**
 * Express /auth 路由
 * route/auth.js
 * 身份认证
 */

// 引入库
const express = require('express');

// 引入配置文件
const {oauth} = require('../config.json');

// 引入控制器
const
    githubCtrl = require('../controllers/auth/github');

// 初始化路由
const router = express.Router();

router.get('/', (req, res) => {

    let resp = "";

    if (req.session.userInfo) {
        resp += `<p>欢迎您 ${req.session.userInfo.name}</p>`;
    }

    resp += `<a href="/auth/oauth/github?redirectURI=https://api.furryhome.cn:19393/auth">GitHub</a>`;

    res.send(resp);
})

// OAuth

// ============= GitHub =============

const {github} = oauth;

router.get('/oauth/github', githubCtrl.request);

router.get('/oauth/github/callback', githubCtrl.callback);


module.exports = router;