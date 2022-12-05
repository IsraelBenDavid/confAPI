const express = require('express')
require('./db/mongoose')
const confessionRouter = require('./routers/confession')

const app = express()

app.use(express.json())
app.use(confessionRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port', port)
})
