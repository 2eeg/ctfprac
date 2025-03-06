const accountService = require('./accountService');
const db = require('./db');

// 함수들을 모듈로 내보내기
module.exports = { 
    getBoards: async function(){
        try {
            const [rows] = await db.query('SELECT posts.id AS id, title, username AS author, is_private FROM posts LEFT JOIN users ON posts.author_id = users.id');
            return rows;
        } catch (error) {
            console.error("게시글 정보 조회 중 오류 발생:", error);
            return [];  // 오류 발생 시 빈 배열 반환
        }
    },
    // 게시글 생성 함수 
    createBoard: async function(board) {
        try{
            await db.query('INSERT INTO posts (title, content, author_id, is_private) VALUES (?, ?, ?, ?)', [board.title, board.content, board.authorID, board.is_private]);
        }
        catch{
            console.error('게시글 생성 중 오류 발생:', error);
        }
    },
    getBoard: async function(boardID) {
        try{
            const [row] = await db.query('SELECT posts.id AS id, title, content, users.username AS author, is_private FROM posts LEFT JOIN users ON posts.author_id = users.id WHERE posts.id = ?', [boardID]);
            return row[0];
        }
        catch(error){
            console.error('게시글 조회 중 오류 발생:', error);
            throw error;
        }
    },
    isAuthor: async function(boardID, sessionID) {
        try{
            const [row] = await db.query('SELECT author_id FROM posts WHERE id = ?', [boardID]);
            return row[0].author_id === global.sessions[sessionID].ID;
        }
        catch(error){
            if(error instanceof TypeError){
                return false;
            }
            else{
                console.error('게시글 작성자 확인 중 오류 발생:', error);
                throw error;
            }
        }
    },
    deleteBoard: async function(boardID) {
        try{
            await db.query('DELETE FROM posts WHERE id = ?', [boardID]);
        }
        catch(error){
            console.error('게시글 삭제 중 오류 발생:', error);
            throw error;
        }
    },
    updateBoard: async function(newBoard){
        try{
            await db.query('UPDATE posts SET title = ?, content = ?, is_private = ? WHERE id = ?', [newBoard.title, newBoard.content, newBoard.id, newBoard.is_private]);
        }
        catch(error){
            console.error('게시글 수정 중 오류 발생:', error);
            throw error;
        }
    }
}


