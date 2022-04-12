require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const PORT = process.env.PORT || 2017
const cors = require('cors')
const models = require('./model/models')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const path = require('path')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const server = express()

server.use(cors())
server.use(express.json())
server.use(express.static(path.resolve(__dirname, 'static')))
server.use(fileUpload({}))

server.use('/api', router)


//Обработка ошибок, последний Middleware
server.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}

start()