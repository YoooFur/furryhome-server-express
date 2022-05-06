/**
 * TranshBin
 * 回收站
 */

const { Schema, model } = require('mongoose');

module.exports = model('TrashBin', new Schema({
    key: String,
    type: String,
    doc: Object,
    ts: Date
}))