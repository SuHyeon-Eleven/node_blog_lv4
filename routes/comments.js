const express = require('express')
const router = express.Router()
const Comments = require('../schemas/comments')

router.post('/:postId', async (req, res) => {
    const { postId } = req.params
    const { user, password, content } = req.body
    if (content == null) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요' })
    }
    if (postId == null || user == null || password == null || postId.length !== 24) {
        return res.status(404).json({ message: '데이터 형식이 올바르지 않습니다' })
    }
    await Comments.create({ postId, user, password, content })

    res.status(200).json({ message: '댓글을 생성하였습니다' })
})

router.get('/:postId', async (req, res) => {
    const { postId } = req.params
    if (postId.length !== 24 || postId == null) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
    const comments = await Comments.find({ postId }).select('commentId user content createdAt -_id').sort('-createdAt')
    res.status(200).json({ data: comments })
})

router.put('/:commentId', async (req, res) => {
    const { commentId } = req.params
    const { password, content } = req.body
    if (commentId == null || commentId.length !== 24) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
    const comment = await Comments.findOne({ commentId })
    if (comment !== null) {
        if (commentId.password !== password) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        await Comments.updateOne({ commentId }, { $set: { content } })
        return res.status(200).json({ message: "댓글을 수정하였습니다." })
    }
    res.status(404).json({ message: '댓글 조회에 실패하였습니다.' })
})

router.delete('/:commentId', async (req, res) => {
    const { commentId } = req.params
    const { password } = req.body
    if (commentId == null || password == null || commentId.length !== 24) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
    const comment = await Comments.findOne({ commentId })
    if (comment !== null) {
        if (comment.password !== password) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        await Comments.deleteOne({ commentId })
        return res.status(200).json({ message: "댓글을 삭제하였습니다." })
    }
    console.log(comment,commentId)
    return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' })

})
module.exports = router