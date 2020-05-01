/*const pgp = require('pg-promise')();
require('dotenv').config()
const connection = pgp(process.env.DATABASE_URL + "?ssl=true");*/
const Sequelize = require('sequelize');
const connection = new Sequelize('d6vgcnti2vi9sf', 'pahugdzzljqqma', 'b3b5950c7acf77a6cd2b92f5886c063407c73b14ddef06f0d11571a080c7987e', {
    host: 'ec2-54-80-184-43.compute-1.amazonaws.com',
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    }
})

module.exports = connection;