const express = require('express')
const router = express.Router()
const Posts = require('../schemas/post.js')

router.get('/posts', async (req, res) => {

    const postsAll = await Posts.find({}).select('postId user title createdAt -_id').sort('-createdAt')

    console.log(postsAll)


    // res.send("post get")
    res.status(200).json({ data: postsAll })
})

router.post('/posts', async (req, res) => {
    const { user, password, title, content } = req.body

    if (user == null || password == null || title == null || content == null) {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' })
    }
    await Posts.create({
        user,
        password,
        title,
        content
    })

    res.status(201).json({ message: "게시글을 생성하였습니다" })
})

router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params
    console.log(postId)
    const post = await Posts.findOne({ postId }).select('postId user title content createdAt -_id')

    res.status(200).json({ data: post })
})
module.exports = router