/**
 * 身份验证 中间件
 * middlewares/auth.js
 */

// 引入库
const {Request, Response, next} = require('express');

module.exports = {
    
    /**
     * 验证身份
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     */
    verify: (req, res, next) => {

        if (!req.session.userInfo) {
            res.send({
                code: -401,
                msg: "未登录"
            });
            return;
        }

        if (req.session.userInfo.role != 'admin') {
            res.send({
                code: -403,
                msg: "无权访问"
            });
            return;
        }
    
        // 跳回
        next();
    }

}