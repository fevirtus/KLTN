const db = require('../db');
const common = require('../common');

module.exports.getAll = (req, res) => {
    let sql = 'SELECT * FROM pet WHERE user_id = :user_id ORDER BY id DESC';
    db.query(sql, { replacements: { user_id: req.userId }, type: db.QueryTypes.SELECT })
        .then(pets => res.json(pets))
        .catch(error => res.json({ error: error }));
}

module.exports.getOthersPet = (req, res) => {
    let sql = `SELECT p.id, p.user_id, p.name, p.avatar, GROUP_CONCAT(pf.img_url) AS pictures 
            FROM pet p
            LEFT JOIN pet_feature pf ON p.id = pf.pet_id
            INNER JOIN user u ON u.uid = p.user_id
            WHERE p.user_id != :user_id AND p.breed = :breed AND p.gender != :gender AND u.hide = 0 AND u.is_delete = 0
            AND NOT EXISTS(
                SELECT * FROM pet_match pm 
                WHERE pm.pet_id1 = :pet_active AND pm.pet_id2 = p.id
            )
            GROUP BY p.id
            ORDER BY RAND() LIMIT 50`;
    db.query(sql, { replacements: { user_id: req.userId, ...req.query }, type: db.QueryTypes.SELECT })
        .then(pets => {
            let newPets = pets.map(pet => {
                let pictures = [];
                if (pet.pictures) pictures = pet.pictures.split(',');
                return { ...pet, pictures: pictures }
            })
            res.json(newPets)
        })
        .catch(error => res.json({ error: error }));
}

module.exports.getAllOthersPet = (req, res) => {
    let sql = `SELECT p.id, p.user_id, p.name, p.avatar, GROUP_CONCAT(pf.img_url) AS pictures 
            FROM pet p
            LEFT JOIN pet_feature pf ON p.id = pf.pet_id
            INNER JOIN user u ON u.uid = p.user_id
            WHERE p.user_id != :user_id AND u.hide = 0 AND u.is_delete = 0
            GROUP BY p.id
            ORDER BY RAND() LIMIT 50`;
    db.query(sql, { replacements: { user_id: req.userId }, type: db.QueryTypes.SELECT })
        .then(pets => {
            let newPets = pets.map(pet => {
                let pictures = [];
                if (pet.pictures) pictures = pet.pictures.split(',');
                return { ...pet, pictures: pictures }
            })
            res.json(newPets)
        })
        .catch(error => res.json({ error: error }));
}

module.exports.getAllPetBreeds = (req, res) => {
    let sql = 'SELECT * FROM pet_breed';
    db.query(sql, { type: db.QueryTypes.SELECT })
        .then(results => res.json(results))
        .catch(error => res.json({ error: error }));
}

module.exports.get = (req, res) => {
    let sql = `SELECT p.*, pb.name as breed_name,GROUP_CONCAT(pf.img_url) AS pictures FROM pet p
            LEFT JOIN pet_breed pb ON p.breed = pb.id
            LEFT JOIN pet_feature pf ON p.id = pf.pet_id
            WHERE p.id = :id
            GROUP BY p.id`;
    db.query(sql, { replacements: { id: req.params.id }, type: db.QueryTypes.SELECT })
        .then(pets => {
            let pet = pets[0];
            let pictures = [];
            if (pet.pictures) {
                pictures = pet.pictures.split(',');
            }
            res.json({
                ...pet,
                pictures: pictures
            })
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.updatePet = (req, res) => {
    let sql = common.buildUpdateSQL(req.body, 'pet');
    db.query(sql, { replacements: { ...req.body.updateFields, id: req.params.id }, type: db.QueryTypes.UPDATE })
        .then(rows => {
            res.json({
                result: 'ok',
                message: `${rows[1]} row(s) affected`,
                data: {
                    id: req.params.id,
                    ...req.body.updateFields
                }
            })
        })
        .catch(error => res.json({ error: error }));
}

module.exports.createNewPet = (req, res) => {
    req.body.user_id = req.userId;
    let sql = common.buildInsertSql(req, 'pet');
    db.query(sql, { replacements: { ...req.body } })
        .then(results => {
            res.json({
                result: 'ok',
                data: {
                    id: results[0],
                    ...req.body
                },
                message: 'insert new pet successfull'
            })
        })
        .catch(error => {
            res.status(442).json({
                result: 'failed',
                data: {},
                message: 'error: ' + error.message
            })
        });
}

module.exports.deletePet = (req, res) => {
    let sql = 'DELETE FROM pet where id = :pet_id AND user_id = :user_id';
    db.query(sql, { replacements: { pet_id: req.params.id, user_id: req.userId }, type: db.QueryTypes.UPDATE })
        .then(result => {
            res.json({
                result: 'ok',
                message: `${result[1]} row(s) affected`
            })
        }).catch(error => res.status(422).json({ error: error }));
}

module.exports.setActivePet = (req, res) => {
    let sql = 'UPDATE pet SET is_active = 0 WHERE user_id = :user_id';
    db.query(sql, { replacements: { user_id: req.userId }, type: db.QueryTypes.UPDATE })
        .then(result => {
            sql = 'UPDATE pet SET is_active = 1 WHERE user_id = :user_id AND id = :pet_id';
            return db.query(sql, { replacements: { pet_id: req.body.pet_id, user_id: req.userId }, type: db.QueryTypes.UPDATE })
        })
        .then(result => {
            res.json({
                result: 'ok',
                message: `${result[1]} row(s) affected`
            })
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.insertPictures = (req, res) => {
    let sql = 'INSERT INTO pet_feature(pet_id, img_url) VALUES ';
    let pictures = req.body.pictures;
    let pet_id = req.params.id;
    let values = pictures.map(pic => `(${pet_id},'${pic}')`).join(',');
    db.query(sql + values)
        .then(results => {
            res.json({
                result: 'ok',
                message: `${results[1]} row(s) affected`
            })
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.getAllInfomation = (req, res) => {
    let sql = `SELECT p.id, p.user_id, p.name, p.avatar, p.gender, pb.name AS breed_name, p.introduction, p.age, p.weight,
            u.name AS user_name, u.avatar AS user_avatar,
            GROUP_CONCAT(pf.img_url) AS pictures
            FROM pet p
            INNER JOIN pet_breed pb ON p.breed = pb.id
            INNER JOIN user u ON p.user_id = u.uid
            LEFT JOIN pet_feature pf ON p.id = pf.pet_id
            WHERE p.id = :id
            GROUP BY p.id`;
    db.query(sql, { replacements: { id: req.params.id }, type: db.QueryTypes.SELECT })
        .then(pets => {
            let pet = pets[0];
            let pictures = [];
            if (pet.pictures) {
                pictures = pet.pictures.split(',');
            }
            res.json({
                ...pet,
                pictures: pictures
            })
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.getTopLike = (req, res) => {
    let sql = `SELECT p.id, p.name, p.gender, p.avatar, COUNT(p.id) AS likes
            FROM pet_reaction pr
            INNER JOIN user u ON pr.user_id = u.uid and u.is_delete = 0
            INNER JOIN pet p ON pr.pet_id = p.id
            GROUP BY p.id
            ORDER BY likes DESC
            LIMIT 10`;
    db.query(sql, { type: db.QueryTypes.SELECT })
        .then(pets => {
            res.json(pets)
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.updateMatch = (req, res) => {
    let condition = req.body.pet_ids.join(',')
    let sql = `UPDATE pet SET matches = matches + 1 WHERE id IN (${condition})`;

    db.query(sql, { type: db.QueryTypes.UPDATE })
        .then(result => {
            res.json({
                result: 'ok',
                message: `${result[1]} row(s) affected`
            })
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.minusMatch = (req, res) => {
    let condition = req.body.pet_ids.join(',')
    let sql = `UPDATE pet SET matches = matches - 1 WHERE id IN (${condition})`;

    db.query(sql, { type: db.QueryTypes.UPDATE })
        .then(result => {
            res.json({
                result: 'ok',
                message: `${result[1]} row(s) affected`
            })
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.getTopMatch = (req, res) => {
    let sql = `SELECT p.id, p.name, pb.name AS breed_name, p.avatar, p.age, p.gender, p.weight, matches 
            FROM pet p
            INNER JOIN user u ON u.uid = p.user_id
            INNER JOIN pet_breed pb ON p.breed = pb.id
            WHERE matches > 0 AND u.is_delete = 0
            ORDER BY matches DESC
            LIMIT 10`;
    db.query(sql, { type: db.QueryTypes.SELECT })
        .then(pets => {
            res.json(pets)
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.isMatch = (req, res) => {
    let sql = `SELECT COUNT(*) as count FROM pet_match WHERE pet_id1 = :pet_active AND pet_id2 = :pet2`;
    db.query(sql, { replacements: { ...req.query }, type: db.QueryTypes.SELECT })
        .then(results => {
            res.json({ isMatch: results[0].count > 0 })
        })
        .catch(error => {
            console.log(error)
            res.status(422).json({ error: error })
        });
}

module.exports.report = (req, res) => {
    let sql = 'INSERT INTO report(pet_id, reason, report_by, img) VALUES (:pet_id, :reason, :report_by, :img)';
    db.query(sql, { replacements: { report_by: req.userId, ...req.body } })
        .then(results => {
            res.json({
                result: 'ok',
                data: {
                    id: results[0],
                    report_by: req.userId,
                    ...req.body
                }
            })
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.nextGeneration = (req, res) => {
    let sql = 'SELECT img FROM pet_generation WHERE breed = :breed ORDER BY RAND() LIMIT 1';
    db.query(sql, { replacements: { breed: req.query.breed }, type: db.QueryTypes.SELECT })
        .then(results => {
            if (results.length == 0) {
                res.json({ img: '' })
            } else {
                res.json(results[0])
            }
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.getPetMatch = (req, res) => {
    let sql = `SELECT p.id, p.avatar, p.name FROM pet_match pm 
                INNER JOIN pet p ON pm.pet_id2 = p.id
                WHERE pet_id1 = :pet_active AND user2 = :user2
                AND EXISTS (
                    SELECT * FROM pet_match pm2
                    WHERE pm2.pet_id2 = pm.pet_id1 AND pm.pet_id2 = pm2.pet_id1
                )
                GROUP BY p.id`;
    db.query(sql, { replacements: { ...req.query }, type: db.QueryTypes.SELECT })
        .then(results => {
            res.json(results)
        })
        .catch(error => res.status(422).json({ error: error }));
}

module.exports.unmatch = (req, res) => {
    let sql = `DELETE FROM pet_match WHERE (pet_id1 = :pet_active AND pet_id2 = :pet2) OR (pet_id2 = :pet_active AND pet_id1 = :pet2)`
    db.query(sql, { replacements: { ...req.body }, type: db.QueryTypes.UPDATE })
        .then(result => {
            res.json({
                result: 'ok',
                message: `${result[1]} row(s) affected`
            })
        })
        .catch(error => res.status(422).json({ error: error }));
}
