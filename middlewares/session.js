/**
 * 会话管理 中间件
 * middlewares/session.js
 */

// 引入库
const {Request, Response, next} = require('express');

module.exports = {
    
    /**
     * 签发
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     */
    generate: (req, res, next) => {

        if (!req.session.u) {
            req.session.u = 1;
            req.session.view = {};
            req.session.like = {};
        }
    
        // 跳回
        next();
    }

}