const express = require('express');
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;

global.sessions = {};

// 라우트 가져오기
const indexRouter = require('./routes/index');
const boardRouter = require('./routes/board');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// nunjucks 설정
nunjucks.configure('./src/views', {
  express: app,
  autoescape: true,
});

app.set('view engine', 'njk');

// 라우트 설정
app.use('/', indexRouter);
app.use('/board', boardRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});