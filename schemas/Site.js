/**
 * Sites
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
        siteName: String,
        siteId: {
            type: Number,
            unique: true
        },
        siteIntro: String,
        siteFavicon: String,
        siteUrl: String,
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