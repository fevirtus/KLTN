const Sequelize = require('sequelize');

const sequelize = new Sequelize('pet_dating_test', 'root', 'Passmysql4869', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
