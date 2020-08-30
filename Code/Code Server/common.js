const db = require('./db');

module.exports.buildInsertSql = (req, tbl) => {
    let sql = `INSERT INTO ${tbl} (`;
    let values = ` VALUES (`;
    for (let property in req.body) {
        sql += `${property},`;
        values += `:${property},`;
    }
    return sql.slice(0, -1) + ')' + values.slice(0, -1) + ')';
}

module.exports.buildUpdateSQL = (data, tbl) => {
    let sql = `UPDATE ${tbl} SET `;
    for (let property in data.updateFields) {
        sql += `${property} = :${property},`;
    }
    return sql.slice(0, -1) + ' WHERE id = :id';
}

module.exports.buildUpdateUserSQL = (data, tbl) => {
    let sql = `UPDATE ${tbl} SET `;
    for (let property in data.updateFields) {
        sql += `${property} = :${property},`;
    }
    return sql.slice(0, -1) + ' WHERE uid = :uid';
}

module.exports.enableUser = async (uid) => {
    try {
        let sql = 'UPDATE user SET is_block = 0 WHERE uid = :uid';
        return await db.query(sql, { replacements: { uid: uid }, type: db.QueryTypes.UPDATE })
    } catch (error) {
        throw error
    }
}

module.exports.disableVIP = async (id) => {
    try {
        let sql = `UPDATE user_vip SET status = 'IN_ACTIVE' WHERE id = :id`;
        return await db.query(sql, { replacements: { id: id }, type: db.QueryTypes.UPDATE })
    } catch (error) {
        throw error
    }
}