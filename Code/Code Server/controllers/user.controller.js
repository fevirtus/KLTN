const geolib = require('geolib');

const db = require('../db');
const common = require('../common');
const moment = require('moment');

module.exports.getCurrentUser = async (req, res) => {
    try {
        let sql = 'SELECT * FROM user WHERE uid = :uid';
        const user = await db.query(sql, { replacements: { uid: req.userId }, type: db.QueryTypes.SELECT });
        if (user[0].is_block == 1) {
            const block_deadline = user[0].block_deadline;
            // const TIME_ZONE = new Date().getTimezoneOffset();
            const ms = new Date(block_deadline).getTime() - new Date().getTime();
            if (ms > 0) {
                const second = Math.floor(ms / 1000);
                const h = Math.floor(second / 3600);
                const m = Math.floor((second - 3600 * h) / 60);
                const s = Math.floor(second - 3600 * h - 60 * m);
                res.json({
                    is_block: 1,
                    remainTime: `${h}h ${m}m ${s}s`
                })
                return
            } else {
                //open
                await common.enableUser(req.userId)
                res.json({
                    ...user[0],
                    is_block: 0
                })
                return
            }
        }
        res.json({
            ...user[0]
        })
    } catch (error) {
        res.json({ error: error })
    }
}

module.exports.get = (req, res) => {
    let sql = `SELECT u.*,
            (SELECT COUNT(1) FROM  user_vip uv WHERE uv.uid = :uid AND STATUS = 'ACTIVE' ORDER BY uv.id DESC LIMIT 1) AS vip
            FROM user u WHERE u.uid = :uid`;
    db.query(sql, { replacements: { uid: req.params.uid }, type: db.QueryTypes.SELECT })
        .then(user => {
            res.json(user)
        })
        .catch(error => res.json({ error: error }));
}

module.exports.updateUser = (req, res) => {
    let sql = common.buildUpdateUserSQL(req.body, 'user');
    db.query(sql, { replacements: { ...req.body.updateFields, uid: req.userId }, type: db.QueryTypes.UPDATE })
        .then(rows => {
            res.json({
                result: 'ok',
                message: `${rows[1]} row(s) affected`,
                data: {
                    ...req.body.updateFields
                }
            })
        })
        .catch(error => { res.json({ error: error }) });
}

module.exports.getDrawer = (req, res) => {
    let sql = `SELECT u.name, u.email, COUNT(DISTINCT(p.id)) AS pets, COUNT(pm.pet_id1) AS matches 
                FROM user u
                INNER JOIN pet p ON u.id = p.user_id
                INNER JOIN pet_match pm ON p.id = pm.pet_id1
                WHERE u.id = :id
                GROUP BY u.id `;
    db.query(sql, { replacements: { id: req.userId }, type: db.QueryTypes.SELECT })
        .then(results => {
            res.json(results)
        })
        .catch(error => res.json({ error: error }));
}

const checkLocationExist = async (req) => {
    try {
        let sql = `SELECT COUNT(1) AS count FROM location WHERE user_id = :user_id`;
        return await db.query(sql, { replacements: { user_id: req.userId }, type: db.QueryTypes.SELECT })
    } catch (error) {
        throw error
    }
}

const insertLocation = async (req) => {
    try {
        let sql = `INSERT INTO location(user_id, latitude, longitude) VALUES (:user_id, :latitude, :longitude)`;
        return await db.query(sql, { replacements: { user_id: req.userId, latitude: req.body.latitude, longitude: req.body.longitude } })
    } catch (error) {
        throw error
    }
}

const updateLocation = async (req) => {
    try {
        let sql = `UPDATE location SET latitude = :latitude, longitude = :longitude WHERE user_id = :user_id`;
        return await db.query(sql, { replacements: { user_id: req.userId, latitude: req.body.latitude, longitude: req.body.longitude }, type: db.QueryTypes.UPDATE })
    } catch (error) {
        throw error
    }
}

module.exports.setLocation = async (req, res) => {
    try {
        const result = await checkLocationExist(req);
        if (result[0].count == 0) {
            await insertLocation(req)
        } else {
            await updateLocation(req)
        }
        res.json({
            result: 'ok',
            data: {
                user_id: req.userId,
                ...req.body
            }
        })
    } catch (error) {
        res.status(422).json({ error: error })
    }
}

const getUsersLocation = async (req) => {
    try {
        let sql = `SELECT u.uid, u.name, u.avatar, l.latitude, l.longitude
                FROM user u
                INNER JOIN location l ON u.uid = l.user_id
                WHERE u.uid != :user_id AND u.hide = 0 AND u.is_delete = 0`;
        return await db.query(sql, { replacements: { user_id: req.userId }, type: db.QueryTypes.SELECT })
    } catch (error) {
        throw error
    }
}

module.exports.filter = async (req, res) => {
    try {
        const DISTANCE = req.query.distance;
        const myLocation = { latitude: req.query.latitude, longitude: req.query.longitude }
        const users_raw = await getUsersLocation(req);
        const users = users_raw.map(user => {
            const dis = geolib.getDistance(myLocation, { latitude: user.latitude, longitude: user.longitude }) // unit = meter

            const disToKm = Math.round(dis * 100 / 1000) / 100
            return {
                uid: user.uid,
                name: user.name,
                avatar: user.avatar,
                distance: disToKm
            }
        }).filter(user => user.distance <= DISTANCE).sort((a, b) => a.distance - b.distance)
        res.json({
            result: users.length,
            data: users
        })

    } catch (error) {
        res.status(422).json({ error: error })
    }
}

module.exports.upgradeToPremium = async (req, res) => {
    try {
        let sql = `INSERT INTO user_vip(uid, confirm_img, from_date, to_date ) VALUES (:uid, :confirm_img, :from_date, :to_date)`;
        let from = moment(new Date(), 'YYYY-MM-DD hh:mm:ss').toDate()
        let to;
        switch (req.body.vip_term) {
            case '1M':
                to = moment(from).add(1, 'months').toDate()
                break;
            case '3M':
                to = moment(from).add(3, 'months').toDate()
                break;
            case '1Y':
                to = moment(from).add(1, 'year').toDate()
                break;
            default:
                break;
        }

        const results = await db.query(sql, { replacements: { uid: req.userId, confirm_img: req.body.confirm_img, from_date: from, to_date: to } });
        res.json({
            result: 'ok',
            data: {
                id: results[0],
                uid: req.userId,
                confirm_img: req.body.confirm_img,
                from_date: from,
                to_date: to
            }
        })
    } catch (error) {
        console.log(error)
        res.status(422).json({ error: error })
    }
}

module.exports.getUserAndPet = (req, res) => {
    let sql = `SELECT u.name, u.email, u.gender, u.birth_date, u.phone, u.avatar, p.id AS pet_id, p.avatar AS pet_avatar,
            (SELECT COUNT(1) FROM  user_vip uv WHERE uv.uid = :uid AND STATUS = 'ACTIVE' ORDER BY uv.id DESC LIMIT 1) AS vip
            FROM user u 
            LEFT JOIN pet p ON u.uid = p.user_id
            WHERE u.uid = :uid AND u.hide = 0 AND u.is_delete = 0`;
    db.query(sql, { replacements: { uid: req.params.uid }, type: db.QueryTypes.SELECT })
        .then(users => {
            const pets = users.map(u => ({ id: u.pet_id, avatar: u.pet_avatar }))
            const user = users[0];
            res.json({
                name: user.name,
                email: user.email,
                gender: user.gender,
                birth_date: user.birth_date,
                phone: user.phone,
                avatar: user.avatar,
                vip: user.vip,
                pets: pets
            })
        })
        .catch(error => {
            res.status(422).json({ error })
        });
}

module.exports.feedback = async (req, res) => {
    try {
        let sql = `INSERT INTO feedback(uid, content, img) VALUES (:uid, :content, :img)`;
        const results = await db.query(sql, { replacements: { uid: req.userId, content: req.body.content, img: req.body.img || null } });
        res.json({
            result: 'ok',
            data: {
                id: results[0],
                uid: req.userId,
                ...req.body
            }
        })
    } catch (error) {
        res.status(422).json({ error: error })
    }
}

module.exports.doVIP = async (req, res) => {
    const PROCESS = 'PROCESS'
    const ACTIVE = 'ACTIVE'
    const IN_ACTIVE = 'IN_ACTIVE'

    try {
        let sql = `SELECT * FROM user_vip WHERE uid = :uid ORDER BY id DESC LIMIT 1`;
        const results = await db.query(sql, { replacements: { uid: req.userId }, type: db.QueryTypes.SELECT });

        if (results.length == 0) {
            res.json({
                vip: 0,
                status: IN_ACTIVE
            })
            return
        }

        const { status, to_date, id } = results[0];

        switch (status) {
            case PROCESS:
                res.json({
                    vip: 0,
                    status: PROCESS
                })
                break;
            case ACTIVE:
                let now = new Date().getMilliseconds()
                let to = new Date(to_date).getMilliseconds()
                if (now == to) {
                    common.disableVIP(id)
                    res.json({
                        vip: 0,
                        status: IN_ACTIVE
                    })
                    return
                }
                res.json({
                    vip: 1,
                    status: ACTIVE,
                    remainTime: to_date
                })
                break;
            case IN_ACTIVE:
                res.json({
                    vip: 0,
                    status: IN_ACTIVE
                })
                break;
            default:
                break;

        }
    } catch (error) {
        res.status(422).json({ error: error })
    }
}
