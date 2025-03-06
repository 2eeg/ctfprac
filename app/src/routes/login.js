const express = require('express');
const router = express.Router();
const accountService = require('../services/accountService');
router.get('/', (req, res) => {
    res.render('login.njk');
});
router.post('/', async (req, res) => {
    const {ID, PW} = req.body;
    try{
        const sessionID = await accountService.login(ID, PW);
        res.cookie('sessionID', sessionID);
        res.send('<script>alert("로그인 성공!");location.href="/";</script>');
    }
    catch(error){
        res.send(`<script>alert("${error.message}");history.back();</script>`);
    }
});
module.exports = router;