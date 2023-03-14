const express = require('express')
const router = express.Router()
const Posts = require('../schemas/post.js')
const Users = require('../schemas/user')
const authMiddleware = require('../middlewares/auth-middleware')



// 전체 게시글 조회
router.get('/', async (req, res) => {
    try {
        const postsAll = await Posts.find({}).select('postId userId nickname title createdAt updatedAt -_id').sort('-createdAt')
        res.status(200).json({ posts: postsAll })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "게시글 조회에 실패하였습니다."
        })
    }
})

// 게시글 작성
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body
        const { nickname } = res.locals.user
        console.log(nickname)
        if (title == null || content == null) {
            res.status(400).json({
                errorMessage: '데이터 형식이 올바르지 않습니다'
            })
        }
        const user = await Users.findOne({ nickname })

        await Posts.create({
            title,
            content,
            nickname,
            userId: user.userId
        })

        res.status(201).json({
            message: "게시글 작성에 성공하였습니다."
        })
    } catch (err) {
        console.log(err)
        res.json({
            errorMessage: "게시글 작성에 실패하였습니다."
        })
    }
})


// 게시글 상세조회
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params
        if (postId.length !== 24) {
            return res.status(400).json({
                errorMessage: '데이터 형식이 올바르지 않습니다.'
            })
        }

        const post = await Posts.findOne({ postId }).select('postId userId nickname title content createdAt updatedAt -_id')

        res.status(200).json({ post: post })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "게시글 조회에 실패하였습니다."
        })
    }
})

// 게시글 수정
router.put('/:postId', authMiddleware, async (req, res) => {
    try {
        const postId = req.params.postId
        const { title, content } = req.body
        if (title == null || content == null) {
            res.status(400).json({
                errorMessage: '데이터 형식이 올바르지 않습니다'
            })
        }
        const user = await Users.findOne({ nickname: res.locals.user.nickname })
        console.log(user)
        console.log(title, content)
        if (postId.length !== 24) {
            return res.status(400).json({
                errorMessage: '데이터 형식이 올바르지 않습니다.'
            })
        }
        const post = await Posts.findOne({ postId, userId: user.userId })
        if (!post) {
            return res.status(403).json({
                errorMessage: "게시글 수정의 권한이 존재하지 않습니다."
            })
        }
        if (post != null) {

            await Posts.updateOne({ postId: postId }, { $set: { title: title, content: content, updatedAt: new Date() } })
            return res.status(200).json({
                message: "게시글을 수정하였습니다."
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "게시글 수정에 실패하였습니다."
        })
    }
})

router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const postId = req.params.postId
        const user = res.locals.user

        if (postId.length !== 24) {
            return res.status(400).json({
                errorMessage: '데이터 형식이 올바르지 않습니다.'
            })
        }
        const post = await Posts.findOne({ postId, nickname: user.nickname })
        if (post != null) {
            await Posts.deleteOne({ postId })
            return res.status(200).json({
                message: '게시글을 삭제하였습니다.'
            })
        }
        res.status(403).json({
            errorMessage: "게시글의 삭제 권한이 존재하지 않습니다."
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "게시글 삭제에 실패하였습니다."
        })
    }

})
module.exports = router