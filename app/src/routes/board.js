const express = require('express');
const boardService = require('../services/boardService');  // 데이터 로직 가져오기
const accountService = require('../services/accountService');
const router = express.Router();

router.use((req, res, next) => {
    if (accountService.isLogined(req)) {
        next();
    } else {
        res.redirect('/login');
    }
});

// 게시판 리스트 페이지
router.get('/', async (req, res) => {
    [ID,boards] = await Promise.all([accountService.getUsernameBySessionID(req.cookies.sessionID), boardService.getBoards()]);
    console.log('boards:',boards);
    res.render('boardHome.njk', {
        ID: ID,
        boards: boards,
    });
});

// 게시판 생성 페이지
router.get('/create', async (req, res) => {
    res.render('boardCreate.njk', {
        ID: await accountService.getUsernameBySessionID(req.cookies.sessionID),
    });
});

// 게시판 생성 프로세스
router.post('/create', async (req, res) => {
    const { title, content } = req.body;
    const is_private = req.body.is_private ? true : false;
    const sessionID = req.cookies.sessionID;
    board = {title, content, authorID: global.sessions[sessionID].ID, is_private};
    console.log('try to create board:',board);
    try{
        await boardService.createBoard(board);
        res.redirect('/board');
    }
    catch(error){
        res.status(500).send('500 Internal Server Error');
    }
});
//게시판 페이지
router.get('/view/:boardID', async (req, res) => {
    const boardID = req.params.boardID;
    try{
        const [username, board, boards, isAuthor] = await Promise.all([accountService.getUsernameBySessionID(req.cookies.sessionID),boardService.getBoard(boardID), boardService.getBoards(), boardService.isAuthor(boardID, req.cookies.sessionID)]);
        if(!isAuthor && board.is_private){
            res.status(403).send('403 Forbidden');
            return;
        }
        res.render('boardView.njk', {
            ID: username,
            boards: boards,
            board: board,
            isAuthor: isAuthor,
        });
    }
    catch(error){
        console.error('게시글 조회 중 오류 발생:', error);
        res.status(500).send('500 Internal Server Error');
    }
});

//게시판 삭제
router.get('/delete/:boardID', async (req, res) => {
    const boardID = req.params.boardID;
    try{
        if (await boardService.isAuthor(boardID, req.cookies.sessionID)) {
            await boardService.deleteBoard(boardID);
            res.redirect('/board');
        } else {
            res.status(403).send('403 Forbidden');
        }
    }
    catch(error){
        res.status(500).send('500 Internal Server Error');
    }

})

//게시판 수정 페이지
router.get('/edit/:boardID', async (req, res) => {
    const boardID = req.params.boardID;
    try{
        if (await boardService.isAuthor(boardID, req.cookies.sessionID)) {
            const [username, board] = await Promise.all([accountService.getUsernameBySessionID(req.cookies.sessionID), boardService.getBoard(boardID)]);
            res.render('boardEdit.njk', {
                ID: username,
                board: board,
            });
        } else {
            res.status(403).send('403 Forbidden');
        }
    }
    catch(error){
        res.status(500).send('500 Internal Server Error');
    }
})

//게시판 수정 프로세스
router.post('/update/:boardID', async (req, res) => {
    const boardID = req.params.boardID;
    if (boardService.isAuthor(boardID, req.cookies.sessionID)) {
        const { title, content } = req.body;
        const is_private = req.body.is_private || false;
        const board = { id: boardID, title, content, is_private};
        try{
            await boardService.updateBoard(board);
            res.redirect(`/board/view/${boardID}`);
        }
        catch(error){
            res.status(500).send('500 Internal Server Error');
        }
    } else {
        res.status(403).send('403 Forbidden');
    }
})

module.exports = router;
