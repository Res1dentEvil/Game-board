const express = require('express')
const mongoose = require('mongoose')
const config = require('config')


const app = express()
//serverPort из файла default.json
const PORT = config.get('serverPort')


// app.use(express.json())
// //auth - url по якому роутер authRouter буде прослуховуватися
// app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(config.get('dbUrl'))
        app.listen(PORT, () => console.log(`server started on port ${PORT}...`))
    } catch (error) {
        console.log(error)
    }
}

start()