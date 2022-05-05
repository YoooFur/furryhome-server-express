/**
 * Sites
 */

/**
 * 2022/5/5
 * 下午睡觉的时候突然记起这个数据库设计有什么坑来着
 * 现在想不起来了
 * 想起来再写注释吧
 */

const {Schema, model} = require('mongoose');

module.exports = model('Site', new Schema({
    cateName: String,
    cateId: {
        type: Number,
        unique: true
    },
    cateIcon: String,
    cateIntro: String,
    siteList: [{
        siteName: {
            type: String,
            required: true
        },
        siteId: {
            type: Number,
            unique: true
        },
        siteIntro: {
            type: String,
            default: "还没有简介欸"
        },
        siteFavicon: {
            type: String,
            default: "https://default.ico"
        },
        siteUrl: {
            type: String,
            required: true
        },
        siteParam: String,
        siteViews: {
            type: Number,
            default: 0
        },
        siteLikes: {
            type: Number,
            default: 0
        },
        siteCreateTime: {
            type: Date,
            default: new Date()
        },
        // active: Boolean
    }]
}))