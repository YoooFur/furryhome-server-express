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
        }).sort({cateId: 1});

        let resultList = [];

        // 获取喜欢状态
        // 一个交叉双循环

        // 遍历分类
        for (let i = 0; i < list.length; i++) {
            const {
                cateId,
                cateName,
                cateIcon,
                cateIntro,
                siteList
            } = list[i];

            // qtmd proxy
            let tempSiteList = [];
            
            // 遍历站点
            for (let j = 0; j < siteList.length; j++) {
                const {
                    siteId,
                    siteName,
                    siteIntro,
                    siteFavicon,
                    siteUrl,
                    siteParam,
                    siteLikes,
                    siteViews,
                    siteCreateTime
                } = siteList[j];

                tempSiteList.push({
                    siteId,
                    siteName,
                    siteIntro,
                    siteFavicon,
                    siteUrl,
                    siteParam,
                    siteLikes,
                    siteViews,
                    siteCreateTime,
                    liked: req.session.like[siteId] ? true : false
                })
            }

            resultList.push({
                cateId,
                cateName,
                cateIcon,
                cateIntro,
                siteList: tempSiteList
            })
        }

        // 响应
        res.send({
            code: 200,
            msg: null,
            data: resultList
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
                    "_id": 0,
                    "siteList._id": 0
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
            info.site.liked = req.session.like[info.site.siteId] ? true : false;
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
            },
            {
                "$sort": {
                    "siteList.siteCreateTime": 1
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
                let site = infoItem.siteList;
                site.liked = req.session.like[site.siteId] ? true : false;
                infoTemp.push({
                    cate: {
                        cateId,
                        cateName,
                        cateIcon,
                        cateIntro
                    },
                    site
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

    /**
     * 数据统计操作 类
     * 
     * 这里有优化空间，但是我懒
     * 
     */
    stats: {

        /**
         * 喜欢
         * @param {Request} req 
         * @param {Response} res 
         */
        async like (req, res) {

            // 获取并判断siteId
            const {siteId} = req.query;

            if (isNaN(siteId)) {
                res.send({
                    code: -400,
                    msg: "参数错误"
                })
                return;
            }

            // 判断是否点过赞
            if (req.session.like[siteId]) {
                res.send({
                    code: -401,
                    msg: "已经喜欢过了哦"
                })
                return;
            }

            // 查找并自增
            r = await Site.findOneAndUpdate({
                "siteList": {
                    "$elemMatch": {
                        "siteId": siteId
                    }
                }
            },{
                "$inc": {
                    "siteList.$.siteLikes": 1
                }
            },{
                new: true,
                multi: false
            })

            let respData = {};

            // 判断返回文档
            if (!r) {
                respData = {
                    code: 404,
                    msg: "没有找到对应站点"
                }
            } else {

                // 简单粗暴的返回data重构
                const {cateId, cateName, cateIcon, cateIntro} = r;
                let cate = {cateId, cateName, cateIcon, cateIntro};
                let site = {};
                for (let i = 0; i < r.siteList.length; i++) {
                    const siteItem = r.siteList[i];
                    if (siteItem.siteId == siteId) {
                        site = siteItem;
                        site.liked = req.session.like[siteItem.siteId] ? true : false;
                        break;
                    }
                }
                respData = {
                    code: 200,
                    msg: null,
                    data: {
                        cate,
                        site
                    }
                }
            }

            req.session.like[siteId] = true;

            res.send(respData);

        },

        /**
         * 浏览
         * @param {Request} req 
         * @param {Response} res 
         */
        async view (req, res) {

            // 判断siteId
            const {siteId} = req.query;

            if (isNaN(siteId)) {
                res.send({
                    code: -400,
                    msg: "参数错误"
                })
                return;
            }

            // 判断是否浏览过
            if (req.session.view[siteId]) {
                res.send({
                    code: -401,
                    msg: "已经浏览过了哦"
                })
                return;
            }

            // 更新数据
            r = await Site.findOneAndUpdate({
                "siteList": {
                    "$elemMatch": {
                        "siteId": siteId
                    }
                }
            },{
                "$inc": {
                    "siteList.$.siteViews": 1
                }
            }, {
                new: true
            })

            let respData = {};

            // 判断返回文档
            if (!r) {
                respData = {
                    code: 404,
                    msg: "没有找到对应站点"
                }
            } else {

                respData = {
                    code: 200,
                    msg: null
                }
            }

            req.session.view[siteId] = true;

            res.send(respData);

        }

    }
}