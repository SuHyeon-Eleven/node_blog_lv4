const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send('루트 페이지 입니다')
})
module.exports = router