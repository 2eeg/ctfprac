const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

/**
 * SQL 쿼리를 실행하고 결과를 반환합니다.
 * @param {string} sql SQL 쿼리문
 * @param {Array} params 쿼리 파라미터
 * @returns {Promise} 쿼리 결과
 */
const query = async (sql, params) => {
    try {
        return await pool.query(sql, params);
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

module.exports = {
    pool,
    query,
};