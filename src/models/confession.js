const mongoose = require('mongoose')


const confessionSchenma = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Buffer
    },
    status: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})


const Confession = mongoose.model('Task', confessionSchenma)


module.exports = Task