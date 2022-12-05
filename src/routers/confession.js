const express = require('express')
const auth = require('../middleware/auth')
const Confession = require("../models/confession");
const User = require("../models/user.js");

const router = new express.Router()

/* Confessions Routs */

router.post('/confessions', auth, async (req, res) => {
    const confession = new Confession({
        ...req.body,
        owner: req.user._id
    })
    // todo: upload image if exist
    try {
        await confession.save()
        res.status(201).send(confession)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/confessions', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'confessions',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.confessions)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/confessions/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const confession = await Confession.findOne({_id, owner: req.user._id})

        if (!confession) {
            return res.status(404).send('confession not found')
        }
        res.send(confession)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.patch('/confessions/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['test', 'status', 'image']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({'error': 'Invalid updates!'})
    }
    const _id = req.params.id

    try {
        const confession = await Confession.findOne({_id, owner: req.user._id})

        if (!confession) {
            return res.status(404).send('confession not found')
        }
        updates.forEach(update => confession[update] = req.body[update])
        await confession.save()
        res.send(confession)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/confessions/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const confession = await Confession.findOneAndDelete({_id, owner: req.user._id})
        if (!confession) {
            return res.status(404).send('confession not found')
        }
        res.send(confession)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router