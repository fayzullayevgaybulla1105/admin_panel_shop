const { Sequelize } = require('sequelize')


module.exports = new Sequelize(
    process.env.DB_NAME, // Baza nomi
    process.env.DB_USER, // Foydalanuvchi
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,  // host 
        port: process.env.DB_PORT   // 2017 da yoki server bilan integratsiya qilgandan keyingi portni oladi
    } 
)