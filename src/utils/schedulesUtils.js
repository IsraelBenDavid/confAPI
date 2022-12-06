const FB = require('fb')


const scheduleNext = async (user, confession) => {
    // create post
    const post = user.lastConfessionIndex+1+'#. ' + confession.text
    // set schedule time
    const time = user.lastConfessionTime + 3600

    // schedule on facebook
    FB.setAccessToken(user.facebookAccessToken);

    out = await FB.api('me/feed', 'post',
        {
            message: post,
            published: false,
            scheduled_publish_time: time
        })

    if(!out || out.error) {
        return !out ? 'error occurred' : out.error
    }
    // update database
    user.lastConfessionIndex++
    user.lastConfessionTime += 3600
    confession.facebookId = out.id
    confession.status = "published"
    confession.confessionIndex = user.lastConfessionIndex
    confession.publishTime = user.lastConfessionTime
    // save changes
    confession.save()
    user.save()
    // console.log(out)
    return out
}


const _getUnixTimestamp = (date = Date.now()) => Math.floor(date / 1000)

const getFirstFutureConfession = async (user) => {
    const match = {
        status: "published",
        publishTime: { $gte: _getUnixTimestamp() }
    }
    const sort = {
        publishTime: 1
    }
    try {
        await user.populate({
            path: 'confessions',
            match,
            options: {
                limit: 1,
                sort
            }
        })
        return user.confessions[0]
    } catch (e) {
        return e
    }
}

const rescheduleConfession = async (user, confession) => {

    FB.setAccessToken(user.facebookAccessToken);

    out = await FB.api(confession.facebookId, 'delete')

    if(!out || out.error) {
        return !out ? 'error occurred' : out.error
    }
    return await scheduleNext(user, confession)
}

const _getCommingHour = () => {
    let hour = Date.now() / 3600000;    // hours since the epoch
    let whole_hour = Math.round(hour);  // rounded up or down
    let next_hour = 1 + whole_hour;     // plus one, per question
    let millis = 3600000 * next_hour;   // convert back to milliseconds
    const nearest = new Date(millis);   // convert to Date object
    return nearest
}

const scheduleConfessionForCommingHour = async (user, confession, index) => {
    // create post
    const post = index+'#. ' + confession.text
    // set schedule time
    const time = await _getUnixTimestamp(_getCommingHour())

    // schedule on facebook
    FB.setAccessToken(user.facebookAccessToken);

    out = await FB.api('me/feed', 'post',
        {
            message: post,
            published: false,
            scheduled_publish_time: time
        })

    if(!out || out.error) {
        return !out ? 'error occurred' : out.error
    }
    // update database
    confession.facebookId = out.id
    confession.status = "published"
    confession.confessionIndex = index
    confession.publishTime = time
    // save changes
    confession.save()
    return out

}

module.exports = {
    scheduleNext,
    getFirstFutureConfession,
    rescheduleConfession,
    scheduleConfessionForCommingHour
}


