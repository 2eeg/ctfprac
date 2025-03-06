const e = require('express');
const db = require('./db');

module.exports = {
    getUsers: async function(){
        try {
            const [rows] = await db.query('SELECT * FROM users');
            return rows;
        } catch (error) {
            console.error('사용자 정보 조회 중 오류 발생:', error);
            return [];
        }
    },
    hashPW: function(PW){
        return require('crypto').createHash('sha512').update(PW).digest('base64');
    },
    isDubplicatedID: async function(ID){
        try{
            [row] = await db.query(`SELECT * FROM users WHERE username = '${ID}'`);
            return row.length > 0;
        }
        catch(error){
            console.error('ID 중복 확인 중 오류 발생:', error);
            throw new Error('Server Error!');
        }
    },
    saveUser: async function(ID, PW){
        let hashedPW = this.hashPW(PW);
        try {
            console.log('try to save user');
            console.log(ID, hashedPW);
            const [result] = await db.query(
                'INSERT INTO users (username, password_hash) VALUES (?, ?)',
                [ID, hashedPW]
            );
            console.log('result:', result);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    },
    login: async function(ID, PW){
        try {
            const [users] = await db.query('SELECT * FROM users WHERE username = ?', [ID]);
            const user = users[0];
            if(user){
                let hashedPW = this.hashPW(PW);
                if(user.password_hash === hashedPW){
                    return this.createSession(user.id);
                }
                else{
                    throw new Error('Wrong password');
                }
            }
            else{
                throw new Error('No such user');
            }
        } catch (error) {
            throw error;
        }
    },
    createSession: function(userID){
        // create sessions
        if (!global.sessions) {
            global.sessions = {};
        }
        let sessionID =  '';
        do{sessionID = require('crypto').randomBytes(20).toString('hex');
        } while(sessionID in global.sessions);
        global.sessions[sessionID] = {ID: userID};

        return sessionID;
    },
    getUsernameBySessionID: async function(sessionID){
        if(global.sessions[sessionID]){
            try{
                [users] = await db.query('SELECT username FROM users WHERE id = ?', [global.sessions[sessionID].ID]);
                return users[0].username;
            }
            catch(error){
                console.error('세션 정보 조회 중 오류 발생:', error);
                throw new Error('Server Error!');
            }
        }else{
            throw new Error('Invalid session');
        };
    },
    deleteSession: function(sessionID){
        delete global.sessions[sessionID];
    },
    isLogined: function(req){
        if(req.cookies.sessionID && global.sessions[req.cookies.sessionID]){
            return true;
        }
        else{
            return false;
        }
    }
}
