const express = require('express')
require('./db/mongoose')
const confessionRouter = require('./routers/confession')
const userRouter = require('./routers/user')
const fbRouter = require('./routers/facebookIntegration')

const app = express()

app.use(express.json())
app.use(confessionRouter)
app.use(userRouter)
app.use(fbRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port', port)
})
