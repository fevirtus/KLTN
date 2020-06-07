const express = require('express');

const db = require('./db');

const PORT = process.env.PORT || 3000;
const app = express();


app.get('/users', (req, res) => {
    db.query('SELECT * FROM user', {
        type: db.QueryTypes.SELECT
    }).then(users => {
        res.json(users);
    });
});

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
}); 
