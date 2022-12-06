const mongoose = require('mongoose')


const confessionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Buffer
    },
    status: {
        type: String,
        default: 'new'
    },
    confessionIndex: {
        type: Number,
        default: 0
    },
    publishTime: {
        type: Number,
        default: 0
    },
    facebookId: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})


const Confession = mongoose.model('Confession', confessionSchema)


module.exports = Confession