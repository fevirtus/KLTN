const jwt = require('jsonwebtoken');

module.exports.authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).send({ error: 'you must be logged in' });
    }
    jwt.verify(authorization, process.env.JWT_KEY, async (err, payload) => {
        if (err) {
            res.status(401).send({ error: 'you must be logged in' });
        }
        const { userId } = payload;
        req.userId = userId;
        next();
    })

}