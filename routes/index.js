const express = require('express')
const postRouter = require('./posts.js')
const commentRouter = require('./comments.js')
const router = express.Router()
//  인덱스에 라우터를 몰아넣음

router.get('/',(req,res)=>{
    res.json('루트 페이지 입니다')
})
router.use('/posts',postRouter)
router.use('/comments',commentRouter)

module.exports = router