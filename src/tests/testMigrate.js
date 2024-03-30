const sequelize = require('../utils/connection');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

const main = async() => {
    try{
        // Acciones a ejecutar antes de los tests
        sequelize.sync();

        const user = {
            firstName: "test",
            lastName: "test",
            email: "test@gmail.com",
            password: "test12345",
            gender: "FEMALE",

        }
        const userTest = await User.findOne({where: {email: "test@gmail.com"}})
        if(!userTest){
            await request(app).post('/users').send(user)
        }
        
        process.exit();
    } catch(error){
        console.log(error);
    }
}

main();