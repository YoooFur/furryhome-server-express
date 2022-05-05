/**
 * 控制器
 * 站点
 * controllers/site.js
 */

// 引入类型
const {Request, Response} = require('express');

// 引入数据模型
const Site = require('../schemas/Site');


module.exports = {

    /**
     * 获取站点列表
     * @param {Request} req 
     * @param {Response} res 
     */
    getSiteList: async (req, res) => {
    
        // 获取列表
        let list = await Site.find();

        console.log(list);

        // 响应
        res.send({
            code: 200,
            msg: null,
            data: list,
            furryhome: "made-with-love-by-colour93"
        })

    }
}