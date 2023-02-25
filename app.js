const express = require("express")
const app = express()   // app 객체 만들기
const port = 3000
const connect = require('./schemas') // 기본으로 schemas의 index 파일 찾음
connect()

app.use(express.json())
app.listen(port, ()=>{
    console.log(`listening at http://localhost:${port}`)
})
