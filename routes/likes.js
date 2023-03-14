const express = require('express')
const router = express.Router()
const Posts = require('../schemas/post')
const Users = require('../schemas/user')
const Likes = require('../schemas/like')
const authMiddleware = require('../middlewares/auth-middleware')

// 게시글 좋아요
router.put('/:postId/like',authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params
        const { userId } = res.locals.user 
        const existLike = await Likes.findOne({ userId,postId })
        const existPost = await Posts.findOne({postId})

        if(!existLike){
            await Likes.create({userId,postId})
            await Posts.updateOne({postId},{$set:{likes: existPost.likes + 1}})
            return res.status(200).json({message: "게시글의 좋아요를 등록하였습니다."})
        }
        await Likes.deleteOne({userId,postId})
        await Posts.updateOne({postId},{$set:{likes: existPost.likes - 1}})
        res.status(200).send({message: "게시글의 좋아요를 취소하였습니다."})
    } catch (err) {
        console.log(err)
        res.status(400).json({
            errorMessage: "게시글 좋아요에 실패하였습니다."
        })
    }
})

// 좋아요 게시글 조회
router.get('/like', authMiddleware, async (req,res)=>{
    try{
        const {userId} = res.locals.user
        let postIds = await Likes.find({userId}).select('postId')
        postIds = postIds.map(element=>{
            return element.postId
        })
        const posts = await Posts.find({postId:postIds}).select('-content -_id -__v')
        res.status(200).json({posts})
    }catch(err){
        console.log(err)
        res.status(400).json({
            errorMessage: "좋아요 게시글 조회에 실패하였습니다."
        })
    }
})
module.exports = router