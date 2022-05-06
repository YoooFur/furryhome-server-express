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
const Counter = require('./Counter');

const schema = new Schema({
    cateName: {
        type: String,
        required: true,
        unique: true
    },
    cateId: {
        type: Number,
        required: true,
        unique: true
    },
    /**
     * 使用 草莓图标库
     * http://www.chuangzaoshi.com/icon/
     * https://github.com/xiangsudian/caomei
     */
    cateIcon: {
        type: String,
        default: "czs-network"
    },
    cateIntro: {
        type: String,
        default: "还没有简介欸"
    },
    siteList: [{
        siteName: {
            type: String,
            unique: true,
            sparse: true
        },
        siteId: {
            type: String,
            unique: true,
            sparse: true
        },
        siteIntro: {
            type: String,
            default: "还没有简介欸"
        },
        siteFavicon: {
            type: String,
            default: "https://fur233.oss-cn-hangzhou.aliyuncs.com/common/default.png"
        },
        siteUrl: {
            type: String,
            unique: true,
            sparse: true
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
            required: true
        },
        // active: Boolean
    }]
});

schema.plugin(require('@mylearningcloud/mongoose-beautiful-unique-validation'));

schema.plugin(Counter.incPlugin, {
    flag: 'Site',
    key: 'cateName',
    targetKey: 'cateId'
});

module.exports = model('Site', schema);