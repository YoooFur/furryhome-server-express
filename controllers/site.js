/**
 * 控制器
 * 站点
 * controllers/site.js
 */

// 引入类型
const { Request, Response } = require('express');

// 引入数据模型
const Site = require('../schemas/Site');


module.exports = {

    /**
     * 获取站点列表
     * @param {Request} req 
     * @param {Response} res 
     */
    getSiteList: async (req, res) => {

        console.log("获取站点列表");

        // 获取列表
        let list = await Site.find(null, {
            "_id": 0
        })

        // 响应
        res.send({
            code: 200,
            msg: null,
            data: list,
            furryhome: "made-with-love-by-colour93"
        })

    },

    /**
     * 通过id获取站点
     * @param {Request} req 
     * @param {Response} res 
     */
    getSiteById: async (req, res) => {

        // 获取请求路径参数
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.send({
                code: -400,
                msg: "参数错误"
            })
            return;
        }

        console.log(`获取站点: ${id}`);

        // 获取站点信息
        let info = await Site.aggregate([
            {
                "$match": {
                    "siteList": {
                        "$elemMatch": {
                            "siteId": id
                        }
                    }
                }
            },
            {
                "$unwind": {
                    "path": "$siteList"
                }
            },
            {
                "$match": {
                    "siteList.siteId": id
                }
            },
            {
                "$project": {
                    "_id": 0
                }
            }
        ])

        // 如果没查到就不管了
        if (info.length) {
            // 对响应信息进行规范
            let infoTemp = info[0];
            const { cateId, cateName, cateIcon, cateIntro } = infoTemp;
            info = {
                cate: {
                    cateId,
                    cateName,
                    cateIcon,
                    cateIntro
                },
                site: infoTemp.siteList
            }
        } else {
            info = null;
        }

        res.send({
            code: 200,
            msg: null,
            data: info
        })
    },

    /**
     * 模糊搜索站点
     * @param {Request} req 
     * @param {Response} res 
     */
    searchSites: async (req, res) => {

        // 获取请求参数
        const {keywords} = req.query;

        const reg = new RegExp(keywords);

        // 查询
        let info = await Site.aggregate([
            { 
                "$match" : { 
                    "siteList" : { 
                        "$elemMatch" : { 
                            "siteName" : reg
                        }
                    }
                }
            }, 
            { 
                "$unwind" : { 
                    "path" : "$siteList"
                }
            }, 
            { 
                "$match" : { 
                    "siteList.siteName" : reg
                }
            }, 
            { 
                "$project" : { 
                    "_id" : 0
                }
            }
        ])

        // 如果没查到就不管了
        if (info.length) {
            // 对响应信息进行规范
            let infoTemp = [];
            for (let i = 0; i < info.length; i++) {
                const infoItem = info[i];
                const { cateId, cateName, cateIcon, cateIntro } = infoItem;
                infoTemp.push({
                    cate: {
                        cateId,
                        cateName,
                        cateIcon,
                        cateIntro
                    },
                    site: infoItem.siteList
                });
            }
            info = infoTemp;
        } else {
            info = null;
        }

        res.send({
            code: 200,
            msg: null,
            data: info
        })

    },

    /**
     * 获取站点分类列表
     * @param {Request} req 
     * @param {Response} res 
     */
    getSiteCateList: async (req, res) => {

        // 获取列表
        let list = await Site.find(null, {
            "_id": 0,
            "siteList": 0
        })

        // 响应
        res.send({
            code: 200,
            msg: null,
            data: list,
            furryhome: "made-with-love-by-colour93"
        })
    },

    /**
     * 通过id获取站点分类
     * @param {Request} req 
     * @param {Response} res 
     */
     getSiteCateById: async (req, res) => {

        // 获取请求路径参数
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.send({
                code: -400,
                msg: "参数错误"
            })
            return;
        }

        console.log(`获取站点分类: ${id}`);

        // 获取站点分类
        let info = await Site.findOne({
            "cateId": id
        }, {
            "_id": 0
        })

        res.send({
            code: 200,
            msg: null,
            data: info
        })
    },
}