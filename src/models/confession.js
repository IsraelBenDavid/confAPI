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
        unique: true
    },
    publishTime: {
        type: Date
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})


const Confession = mongoose.model('Confessions', confessionSchema)


module.exports = Confession