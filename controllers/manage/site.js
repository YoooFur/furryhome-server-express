/**
 * 控制器
 * 站点管理
 * controllers/manage/site.js
 */

// 引入库
const {simpleflake} = require("simpleflakes");

// 引入类型
const { Request, Response } = require('express');
const Site = require('../../schemas/Site');
const TrashBin = require("../../schemas/TrashBin");

module.exports = {

    /**
     * 增加站点分类
     * @param {Request} req 
     * @param {Response} res 
     */
    addSiteCate: async (req, res) => {

        // 校验传输数据完整性及其类型
        const {
            name,
            intro,
            icon
        } = req.body;

        if (
            (typeof name != 'string' || !name) ||
            (typeof intro != 'string' && intro != null) ||
            (typeof icon != 'string' && icon != null)
        ) {
            res.send({
                code: -401,
                msg: "参数错误"
            });
            return;
        }


        // 更新集合
        let result;
        try {
            result = await Site.create({
                cateName: name,
                cateIntro: intro,
                cateIcon: icon,
                operator: req.session.userInfo.id
            })
        } catch (error) {
            if (error._message == "Validation failed") {
                res.send({
                    code: -422,
                    msg: "数据验证失败",
                    data: error.errors
                })
                return;
            }
        }
        
        delete result._id;
        delete result.__v;

        console.log(`新增网站分类: ${result.cateName}`);

        res.send({
            code: 200,
            msg: null,
            data: result
        })
    },

    /**
     * 更新站点分类信息
     * @param {Request} req
     * @param {Response} res
     */
    updateSiteCate: async (req, res) => {

        // 校验传输数据完整性及其类型
        const {
            id,
            name,
            intro,
            icon
        } = req.body;

        if (
            (typeof id != 'number' || !id) ||
            (typeof name != 'string' && name != null) ||
            (typeof intro != 'string' && intro != null) ||
            (typeof icon != 'string' && icon != null)
        ) {
            res.send({
                code: -401,
                msg: "参数错误"
            });
            return;
        }

        // 执行更新操作
        r = await Site.findOneAndUpdate({
            cateId: id
        }, {
            $set: {
                cateName: name,
                cateIntro: intro,
                cateIcon: icon,
                operator: req.session.userInfo.id
            }
        }, {
            new: true,
            projection: {
                _id: 0,
                __v: 0
            }
        })

        if (!r) {
            res.send({
                code: 404,
                msg: "未找到对应站点分类"
            });
        } else {
            console.log(`已更新站点分类: ${id}. ${r.cateName}: ${r.cateIntro}`);
            res.send({
                code: 200,
                msg: null,
                data: r
            });
        }

    },

    /**
     * 删除站点分类信息
     * @param {Request} req
     * @param {Response} res
     */
     deleteSiteCate: async (req, res) => {

        // 校验传输数据完整性及其类型
        const {
            id,
            force
        } = req.body;

        if (
            (typeof id != 'number' || !id) || 
            (typeof force != 'boolean' && force)
        ) {
            res.send({
                code: -401,
                msg: "参数错误"
            });
            return;
        }

        // 检查是否有强制删除
        if (!force) {

            // 检查欲删除的分类是否为空
            result = await Site.findOne({cateId: id});

            if (!result) {
                res.send({
                    code: 404,
                    msg: "未找到对应分类"
                });
                return;
            }

            if (result.siteList.length) {
                res.send({
                    code: -421,
                    msg: "对应分类下站点非空"
                });
                return;
            }

        }

        // 删除整个集合
        originDoc = await Site.findOne({cateId: id});
        r = await TrashBin.create({
            key: 'sites',
            type: 'cate',
            doc: originDoc,
            ts: Date.now()
        })
        r = await Site.deleteOne({
            cateId: id
        })

        if (!r.deletedCount) {
            console.log(`删除站点分类: ${id}. ${result.cateName}`);
            res.send({
                code: 200,
                msg: `已删除 1 各分类及 ${originDoc.siteList.length} 个站点`
            })
        } else {
            res.send({
                code: 500,
                msg: "发生未知错误",
                data: {
                    searchResult: result,
                    deleteResult: r
                }
            });
        }
    },

    /**
     * 增加站点
     * @param {Request} req
     * @param {Response} res
     */
    addSite: async (req, res) => {

        // 校验传输数据完整性及其类型
        const {
            cateId,
            name,
            intro,
            favicon,
            url,
            param
        } = req.body;

        if (
            (typeof cateId != 'number' || !cateId) ||
            (typeof url != 'string' || !url) ||
            (typeof name != 'string' || !name) ||
            (typeof intro != 'string' && intro != null) ||
            (typeof favicon != 'string' && favicon != null) ||
            (typeof param != 'string' && param != null)
        ) {
            res.send({
                code: -401,
                msg: "参数错误"
            });
            return;
        }

        // 二次校验部分数据
        const urlReg = /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/;
        if (!urlReg.test(url)) {
            res.send({
                code: -400,
                msg: "URL填写不正确，不支持路径及参数"
            });
            return;
        }
        const paramReg = /^\?(\w+=\w+&?){0,62}$/;
        if (param && !paramReg.test(param)) {
            res.send({
                code: -400,
                msg: `参数填写不正确，请参照正确的HTTP参数格式(含"?")`
            });
            return;
        }

        // 插值
        const flake = simpleflake();
        siteId = flake.toString();

        r = await Site.findOneAndUpdate({
            cateId
        }, {
            $addToSet: {
                siteList: {
                    siteId,
                    siteName: name,
                    siteIntro: intro,
                    siteFavicon: favicon,
                    siteUrl: url,
                    siteParam: param,
                    siteCreateTime: Date.now(),
                    operator: req.session.userInfo.id
                }
            }
        }, {
            new: true
        });

        if (!r) {
            res.send({
                code: 404,
                msg: "对应分类未找到"
            });
            return;
        };

        // 简单粗暴的返回data重构
        const {cateName, cateIcon, cateIntro} = r;
        let cate = {cateId, cateName, cateIcon, cateIntro};
        let site = {};
        for (let i = 0; i < r.siteList.length; i++) {
            const siteItem = r.siteList[i];
            if (siteItem.siteId == siteId) {
                site = siteItem;
                delete site._id;
                break;
            }
        }

        console.log(`增加站点: ${cateId}. ${cateName} - ${site.siteName} - ${site.siteUrl}`);

        res.send({
            code: 200,
            msg: null,
            data: {
                cate,
                site
            }
        });

    },

    /**
     * 更新站点
     * @param {Request} req
     * @param {Response} res
     */
    updateSite: async (req, res) => {

        // 校验传输数据完整性及其类型
        const {
            id,
            name,
            intro,
            favicon,
            url,
            param
        } = req.body;

        if (
            (typeof id != 'string' || !id) ||
            (typeof url != 'string' && url != null) ||
            (typeof name != 'string' && name != null) ||
            (typeof intro != 'string' && intro != null) ||
            (typeof favicon != 'string' && favicon != null) ||
            (typeof param != 'string' && param != null)
        ) {
            res.send({
                code: -401,
                msg: "参数错误"
            });
            return;
        }

        // 二次校验部分数据
        const urlReg = /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/;
        if (url && !urlReg.test(url)) {
            res.send({
                code: -400,
                msg: "URL填写不正确，不支持路径及参数"
            });
            return;
        }
        const paramReg = /^\?(\w+=\w+&?){0,62}$/;
        if (param && !paramReg.test(param)) {
            res.send({
                code: -400,
                msg: `参数填写不正确，请参照正确的HTTP参数格式(含"?")`
            });
            return;
        }

        // 更新数据
        r = await Site.findOneAndUpdate({
            siteList: {
                $elemMatch: {
                    siteId: id
                }
            }
        }, {
            $set: {
                "siteList.$.siteName": name,
                "siteList.$.siteUrl": url,
                "siteList.$.siteFavicon": favicon,
                "siteList.$.siteIntro": intro,
                "siteList.$.siteParam": param,
                "siteList.$.operator": req.session.userInfo.id
            }
        }, {
            new: true
        })

        
        if (!r) {
            res.send({
                code: 404,
                msg: "对应分类未找到"
            });
            return;
        };

        // 简单粗暴的返回data重构
        const {cateId, cateName, cateIcon, cateIntro} = r;
        let cate = {cateId, cateName, cateIcon, cateIntro};
        let site = {};
        for (let i = 0; i < r.siteList.length; i++) {
            const siteItem = r.siteList[i];
            if (siteItem.siteId == id) {
                site = siteItem;
                delete site._id;
                break;
            }
        }

        console.log(`更新站点: ${cateId}. ${cateName} - ${site.siteName} - ${site.siteUrl}`);

        res.send({
            code: 200,
            msg: null,
            data: {
                cate,
                site
            }
        });
    },

    /**
     * 删除站点
     * @param {Request} req
     * @param {Response} res
     */
    deleteSite: async (req, res) => {

        // 校验传输数据完整性及其类型
        const {
            id
        } = req.body;

        if (
            (typeof id != 'string' || !id)
        ) {
            res.send({
                code: -401,
                msg: "参数错误"
            });
            return;
        }

        // 删除整个集合
        originDoc = await Site.aggregate([
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
            }
        ])
        r = await TrashBin.create({
            key: 'sites',
            type: 'site',
            doc: originDoc,
            ts: Date.now()
        })
        r = await Site.updateOne({
            siteList: {
                $elemMatch: {
                    siteId: id
                }
            }
        }, {
            $pull: {
                siteList: {
                    siteId: id
                }
            }
        })

        if (!r.matchedCount) {
            res.send({
                code: 404,
                msg: "未找到对应站点"
            });
            return;
        }

        if (r.modifiedCount) {
            console.log(`删除站点: ${id}. ${originDoc.siteList.siteName}`);
            res.send({
                code: 200,
                msg: `已删除 ${r.modifiedCount} 个站点`
            });
            return;
        }

        res.send({
            code: 500,
            msg: "删除时出现错误",
            data: r
        })
    }
}