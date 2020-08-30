const db = require('../db');
const common = require('../common');

module.exports.getProfile = (req, res) => {
    let sql = `SELECT u.name, u.email, COUNT(DISTINCT(p.id)) AS pets, COUNT(pm.pet_id1) AS matches 
                FROM user u
                LEFT JOIN pet p ON u.id = p.user_id
                LEFT JOIN pet_match pm ON p.id = pm.pet_id1
                WHERE u.id = :id
                GROUP BY u.id `;
    db.query(sql, { replacements: { id: req.userId }, type: db.QueryTypes.SELECT })
        .then(results => {
            res.json(results)
        })
        .catch(error => res.json({ error: error }));
}

module.exports.react = (req, res) => {
    let sql = 'INSERT INTO pet_reaction(user_id, pet_id, reaction) VALUES (:user_id, :pet_id, :reaction)';
    db.query(sql, { replacements: { user_id: req.userId, pet_id: req.body.pet_id, reaction: req.body.reaction } })
        .then(result => {
            res.json({
                result: 'ok',
                data: {
                    id: result[0],
                    user_id: req.userId,
                    pet_id: req.body.pet_id,
                    reaction: req.body.reaction
                }
            })
        })
        .catch(error => res.status(422).json({ error: error }))
}
module.exports.match = async (req, res) => {
    try {
        let sql = 'INSERT INTO pet_match(user1, pet_id1, user2, pet_id2) VALUES (:user1, :pet_id1, :user2, :pet_id2)';
        await db.query(sql, { replacements: { user1: req.userId, ...req.body } })
        let checkMatch = `SELECT pm.user1 AS guestUid,u1.name AS guestName, u1.avatar as guestAvatar
                    FROM pet_match pm
                    INNER JOIN USER u1 ON u1.uid = pm.user1
                    WHERE pm.pet_id1 = :pet_id2 AND pm.pet_id2 = :pet_id1`;
        const matches = await db.query(checkMatch, { replacements: { ...req.body }, type: db.QueryTypes.SELECT })
        console.log(matches)
        if (matches.length == 0) {
            res.json({
                result: 'not ok',
                data: {},
                message: 'waiting for love'
            })
        } else {
            res.json({
                result: 'ok',
                data: { ...matches[0] },
                message: 'match successfull'
            })
        }
    } catch (error) {
        res.status(422).json({ error: error })
    }


}