/**
 * 控制器
 * 通用身份认证
 * controllers/auth/auth.js
 */

// 引入类型
const { Request, Response } = require('express');

// 引入数据模型
const User = require('../../schemas/User');

module.exports = {

    /**
     * OAuth登录换取userInfo
     * @param {String} type 登陆模式：github
     * @param {Object} userInfoObj OAuth返回数据
     * @param {Request} req express.req 用于设置session
     */
    oauth: async (type, userInfoObj, req) => {

        let r;

        console.log(`OAuth 登录请求: ${type} - ${userInfoObj.id}`);

        let queryObject = {};
        queryObject[`oauth.${type}.id`] = userInfoObj.id;

        // 查找用户
        r = await User.findOne(queryObject, {
            _id: 0,
            __v: 0
        });

        // 新用户注册（？
        const {name, avatar_url, login, email} = userInfoObj;
        if (!r) {
            let userInfo = {
                login,
                name,
                email,
                avatar_url,
                oauth: {}
            }
            userInfo.oauth[type] = userInfoObj;
            try {
                r = await User.create(userInfo);
            } catch (error) {
                console.log(error);
            }
        }

        req.session.userInfo = r;

        return;
    }

}