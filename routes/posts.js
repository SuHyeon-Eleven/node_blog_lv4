const express = require('express')
const { mongoose } = require('mongoose')
const router = express.Router()
const Posts = require('../schemas/post.js')
const ObjectId = mongoose.Types.ObjectId

// 전체 게시글 조회
router.get('/', async (req, res) => {
    try {
        const postsAll = await Posts.find({}).select('postId user title createdAt -_id').sort('-createdAt')

        res.status(200).json({ data: postsAll })
    } catch (err) {
        console.log(err)
        res.json({
            message: err
        })
    }
})

// 게시글 작성
router.post('/posts', async (req, res) => {
    try {
        const { user, password, title, content } = req.body

        if (user == null || password == null || title == null || content == null) {
            res.status(400).json({
                message: '데이터 형식이 올바르지 않습니다'
            })
        }
        await Posts.create({
            user,
            password,
            title,
            content
        })

        res.status(201).json({
            message: "게시글을 생성하였습니다"
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: err
        })
    }
})

// 게시글 상세조회
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params
        if (postId.length !== 24) {
            return res.status(400).json({
                message: '데이터 형식이 올바르지 않습니다.'
            })
        }
        const post = await Posts.findOne({ postId }).select('postId user title content createdAt -_id')

        res.status(200).json({ data: post })
    } catch (err) {
        console.log(err)
        res.json({
            message: err
        })
    }
})

// 게시글 수정
router.put('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId
        const { password, title, content } = req.body
        console.log(password, title, content)
        if (postId.length !== 24) {
            return res.status(400).json({
                message: '데이터 형식이 올바르지 않습니다.'
            })
        }
        const post = await Posts.findOne({ postId })

        if (post != null) {
            if (post.password !== password) {
                return res.status(400).json({
                    message: "데이터 형식이 올바르지 않습니다."
                })
            }
            await Posts.updateOne({ postId: postId }, { $set: { title: title, content: content } })
            return res.status(200).json({
                message: "게시글을 수정하였습니다."
            })
        }
        res.status(404).json({
            message: '게시글 조회에 실패하였습니다.'
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: err
        })
    }
})

router.delete('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId
        const { password } = req.body

        if (postId.length !== 24) {
            return res.status(400).json({
                message: '데이터 형식이 올바르지 않습니다.'
            })
        }

        const post = await Posts.findOne({ postId })
        if (post != null) {
            if (post.password !== password) {
                return res.status(400).json({
                    message: '데이터 형식이 올바르지 않습니다.'
                })
            }
            await Posts.deleteOne({ postId })
            return res.status(200).json({
                message: '게시글을 삭제하였습니다.'
            })
        }

        res.status(400).json({
            message: '게시글 조회에 실패하였습니다.'
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: err
        })
    }

})
module.exports = router