/**
 * Counters
 * 自增计数器集合
 */

const { Schema, model } = require('mongoose');

const couterSchema = new Schema({
    flag: {
        type: String,
        unique: true
    },
    count: {
        type: Number,
        default: 0
    },
    docuList: [{
        key: {
            type: String,
            unique: true
        },
        id: {
            type: Number,
            unique: true
        }
    }]
})

const counterModel = model('Counter', couterSchema);

/**
 * 自增插件
 * @param {Schema} targetSchema
 * @param {object} options flag key targetKey
 */
function incPlugin(targetSchema, options) {

    // 增加字段
    targetSchema.add({
        cateId: Number
    })

    // 监听预处理
    targetSchema.pre('validate', async function (next) {
        const { flag, key, targetKey } = options;

        // 查找是否存在
        r = await counterModel.findOne({
            docuList: {
                $elemMatch: {
                    key: this[key]
                }
            }
        })
        if (r) {
            next();
            return;
        };

        // 自增
        r = await counterModel.findOneAndUpdate({
            flag
        }, {
            $inc: {
                count: 1
            }
        }, {
            upsert: true,
            new: true
        })
        id = r.count;
        r = await counterModel.updateOne({
            flag
        }, {
            $addToSet: {
                docuList: {
                    key: this[key],
                    id
                }
            }
        })

        this[targetKey] = id;
        next();
    })
}

/**
 * 自增函数
 * @param {string} collectionName
 */
const incFunction = (collectionName) => {

}

/**
 * 删除插件
 * @param {Schema} targetSchema
 * @param {object} options flag targetKey
 */
 function decPlugin(targetSchema, options) {

    // 监听预处理
    targetSchema.pre('deleteOne', async function (next) {
        const { flag, targetKey } = options;

        // 删文档
        r = await counterModel.updateOne({flag}, {
            $pull: {
                docuList: {
                    id: this['_conditions'][targetKey]
                }
            }
        })

        next();
    })
}

module.exports = {
    incPlugin,
    decPlugin,
    incFunction,
    counterModel
}