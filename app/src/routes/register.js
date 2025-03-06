const express = require('express');
const router = express.Router();
const accountService = require('../services/accountService');

router.get('/', (req, res) => {
    res.render('register.njk');
});
router.post('/', async (req, res) => {
    const {ID, PW} = req.body;
    try{
        await accountService.saveUser(ID, PW);
        res.send('<script>alert("회원가입 완료");location.href="/login";</script>');
        return;
    }
    catch(error){
        if(error.code === 'ER_DUP_ENTRY'){
            res.send('<script>alert("duplicated ID is exist.");history.back();</script>');
            return;
        }
        else{
            console.error('회원가입 중 오류 발생:', error);
            res.send('<script>alert("회원가입 실패 server error!");history.back();</script>');
            return;
        }
    }
});
router.post('/checkID', async (req, res) => {
    const { ID } = req.body;
    try{
        res.json({result : await accountService.isDubplicatedID(ID)});
    }
    catch(error){
        res.json(error);
    }
});
module.exports = router;