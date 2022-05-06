/**
 * 控制器
 * GitHub 身份认证
 * controllers/auth/github.js
 */

// 引入类型
const { Request, Response } = require('express');

// 引入数据模型
// const Site = require('../schemas/Site');

// 引入库
const axios = require('axios');

// 引入配置文件
const {github} = require('../../config.json').oauth;
let {proxy} = require('../../config.json');

// 判断运行环境，切换代理
proxy = process.env.dev ? proxy.dev : proxy.prod;

module.exports = {

    /**
     * 登陆预处理
     * @param {Request} req 
     * @param {Response} res
     */
    request: (req, res) => {

        console.log("GitHub 登录请求");

        // 检查是否有redirectURI
        if (req.query.redirectURI) {
            
            // 以及校验
            try {
                let redirectURI = new URL (req.query.redirectURI);
                
                if ( redirectURI.hostname.substring(redirectURI.hostname.length - 12) != 'furryhome.cn' ) {
                    res.send({
                        code: -400,
                        msg: "redirectURI有误，请勿填写非业务域名"
                    });
                    return;
                }

            } catch (error) {

                if (error.code == 'ERR_INVALID_URL') {
                    res.send({
                        code: -400,
                        msg: "redirectURI格式有误"
                    });
                    return;
                } else {
                    res.send({
                        code: 500,
                        msg: "服务器内部错误"
                    });
                    console.log(error);
                    return;
                }

            }

            // 然后就可以放到session里了
            req.session.redirectURI = req.query.redirectURI;

        }

        // 重定向到认证接口
        res.redirect('https://github.com/login/oauth/authorize?client_id=' + github.client_id);
    },

    /**
     * 登陆后认证回调
     * @param {Request} req 
     * @param {Response} res 
     */
    callback: async (req, res) => {

        console.log("GitHub 回调请求");

        // 服务器认证成功，回调带回认证状态code
        const {code} = req.query;
        const params = {
            client_id: github.client_id,
            client_secret: github.client_secret,
            code
        }
        
        // 申请令牌token

        try {
            r = await axios({
                method: 'post',
                url: 'https://github.com/login/oauth/access_token',
                params,
                proxy
            })
            const access_token = (new URLSearchParams(r.data)).get('access_token');
    
            r = await axios({
                method: 'get',
                url: 'https://api.github.com/user',
                headers: {
                'Authorization': 'token ' + access_token
                },
                proxy
            });
            
        } catch (error) {
            console.erro(error);
            res.send({
                code: -410,
                msg: "服务器请求出错，请返回首页重试"
            });
            return;
        }

        // 把信息和session绑定
        const {name, avatar_url, id, login} = r.data;
        req.session.userInfo = {
            name,
            avatar_url,
            id,
            login
        }

        // 读取session中的重定向
        const redirectURI = req.session.redirectURI || "https://furryhome.cn";
        res.redirect(redirectURI);
    }

}