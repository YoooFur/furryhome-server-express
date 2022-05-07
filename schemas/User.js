/**
 * Users
 * 身份认证系统
 */

const {Schema, model} = require('mongoose');
const Counter = require('./Counter');

const schema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    role: {
        type: String,
        default: "member"
    },
    avatar_url: {
        type: String,
        default: "https://fur233.oss-cn-hangzhou.aliyuncs.com/common/default.png"
    },
    // 只要我不写pwd，就不会有泄露风险
    oauth: {
        github: {
            id: Number,
            login: String,
            name: String,
            avatar_url: String,
            email: String
        }
    }
});

schema.plugin(require('@mylearningcloud/mongoose-beautiful-unique-validation'));

schema.plugin(Counter.incPlugin, {
    flag: 'User',
    key: 'login',
    targetKey: 'id'
});

module.exports = model('User', schema);