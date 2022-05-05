/**
 * Groups
 */

const { Schema, model } = require('mongoose');

module.exports = model('Group', new Schema({
    cateName: String,
    cateId: {
        type: Number,
        unique: true
    },
    cateIcon: String,
    cateIntro: String,
    groupList: [{
        groupName: String,
        groupId: {
            type: Number,
            unique: true
        },
        groupIntro: String,
        groupAvatar: String,
        groupNumber: String,
        groupUrl: String,
        groupLikes: Number,
        groupCreateTime: Date,
        active: Boolean
    }]
}))