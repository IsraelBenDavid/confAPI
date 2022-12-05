const express = require('express')
require('./db/mongoose')
const confessionRouter = require('./routers/confession')
const userRouter = require('./routers/user')

const app = express()

app.use(express.json())
app.use(confessionRouter)
app.use(userRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port', port)
})
