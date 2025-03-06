const express = require('express');
const router = express.Router();

// 홈 페이지
// 로그인이 되어있으면 게시판으로 리다이렉트
// 로그인이 안되어있으면 로그인 페이지로 리다이렉트
router.get('/', (req, res) => {
    if(req.cookies.sessionID && global.sessions[req.cookies.sessionID]){
        res.redirect('/board');
    }
    else{
        res.redirect('/login');
    }
});
router.get('/logout', (req, res) => {
    delete global.sessions[req.cookies.sessionID];
    res.clearCookie('sessionID');
    res.redirect('/');
});
module.exports = router;