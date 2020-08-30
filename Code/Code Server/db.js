const Sequelize = require('sequelize');
//mysql://bf8a1b55c1e2e6:8c8d6ed8@us-cdbr-east-02.cleardb.com/heroku_0d15c6611609f1f?reconnect=true
const sequelize = new Sequelize('heroku_0d15c6611609f1f', 'bf8a1b55c1e2e6', '8c8d6ed8', {
    host: 'us-cdbr-east-02.cleardb.com',
    dialect: 'mysql'
});

module.exports = sequelize;
