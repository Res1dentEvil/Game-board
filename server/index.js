const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const authRouter = require('./routes/auth.routes')


const app = express()
//serverPort из файла default.json
const PORT = config.get('serverPort')

//розпарсить json строку
app.use(express.json())

// //auth - url по якому роутер authRouter буде прослуховуватися
app.use('api/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(config.get('dbUrl'))
        app.listen(PORT, () => console.log(`server started on port ${PORT}...`))
    } catch (error) {
        console.log(error)
    }
}

start()