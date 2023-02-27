const express = require("express")
const app = express()   // app 객체 만들기
const port = 3000

const connect = require('./schemas') // 기본으로 schemas의 index 파일 찾음
connect()

// 라우터 등록
const postsRouter = require('./routes/posts.js')
const commentsRouter = require('./routes/comments.js')
const indexRouter = require('./routes/index.js')

app.use(express.json())
// 라우터 미들웨어
app.use( [indexRouter, postsRouter, commentsRouter])

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})
