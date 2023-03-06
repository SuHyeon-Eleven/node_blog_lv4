const express = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const router = express.Router()
const Comments = require('../schemas/comments')
const Users = require('../schemas/user')
// 댓글 작성 
router.post('/:postId/comments', authMiddleware, async (req, res) => {
    try {
        const { nickname } = res.locals.user
        const user = await Users.findOne({ nickname })
        const { postId } = req.params
        const { comment } = req.body
        if (comment == null || postId.length !== 24) {
            return res.status(400).json({
                errorMessage: '데이터 형식이 올바르지 않습니다.'
            })
        }

        await Comments.create({
            postId,
            comment,
            nickname: user.nickname,
            userId: user.userId
        })

        res.status(200).json({
            message: '댓글을 작성하였습니다'
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "댓글 작성에 실패하였습니다."
        })
    }

})

// 댓글 목록 조회
router.get('/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params
        if (postId.length !== 24 || postId == null) {
            return res.status(400).json({
                message: '데이터 형식이 올바르지 않습니다.'
            })
        }
        const comments = await Comments.find({ postId }).select('commentId userId comment nickname createdAt updatedAt -_id').sort('-createdAt')
        res.status(200).json({ comments: comments })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "댓글 조회에 실패하였습니다"
        })
    }
})

// 댓 글 수정
router.put('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const user = res.locals.user
        const { postId, commentId } = req.params
        console.log(postId, commentId)
        const { comment } = req.body
        if (comment == null) {
            return res.status(400).json({
                errorMessage: '데이터 형식이 올바르지 않습니다.'
            })
        }
        const existComment = await Comments.findOne({ commentId, nickname: user.nickname })
        if (existComment !== null) {
            await Comments.updateOne({ commentId }, { $set: { comment, updatedAt: new Date() } })
            return res.status(200).json({
                message: "댓글을 수정하였습니다."
            })
        }
        res.status(404).json({
            errorMessage: '댓글이 존재하지 않습니다.'
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "댓글 수정에 실패하였습니다."
        })
    }
})

// 댓글 삭제
router.delete('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const user = res.locals.user
        const { postId, commentId } = req.params
        if (commentId == null || commentId.length !== 24) {
            return res.status(400).json({
                errorMessage: '데이터 형식이 올바르지 않습니다.'
            })
        }
        const comment = await Comments.findOne({ commentId, nickname: user.nickname })
        if (comment !== null) {
            await Comments.deleteOne({ commentId })
            return res.status(200).json({
                message: "댓글을 삭제하였습니다."
            })
        }
        console.log(comment, commentId)
        return res.status(404).json({
            errorMessage: '댓글이 존재하지 않습니다.'
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "댓글 삭제에 실패하였습니다."
        })
    }
})
module.exports = router