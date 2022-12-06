const express = require('express')
const FB = require('fb')

const auth = require('../middleware/auth')
const Confession = require("../models/confession");
const User = require("../models/user.js");
const {
    scheduleNext,
    getFirstFutureConfession,
    rescheduleConfession,
    scheduleConfessionForCommingHour
} = require("../utils/schedulesUtils")

const router = new express.Router()

router.post('/fb/schedulenext/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const confession = await Confession.findOne({_id, owner: req.user._id})

        if (!confession) {
            return res.status(404).send('confession not found')
        }
        if (confession.status === "published") {
            return res.status(400).send('confession already published')
        }

        out = await scheduleNext(req.user, confession)
        res.send(out)

    } catch (e) {
        res.status(500).send(e)
    }
})


router.post('/fb/schedulenow/:id', auth, async (req, res) => {
    const _id = req.params.id
    const newConfession = await Confession.findOne({_id, owner: req.user._id})
    oldConfession = await getFirstFutureConfession(req.user)
    oldConfessionIndex = oldConfession.confessionIndex
    out = await rescheduleConfession(req.user, oldConfession)

    res.send(await scheduleConfessionForCommingHour(req.user, newConfession, oldConfessionIndex))
})



module.exports = router