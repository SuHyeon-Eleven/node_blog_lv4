const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const authMiddleware = require('../middlewares/auth-middleware')
const User = require('../schemas/user')
const bcrypt = require('bcrypt')

const signupUserSchema = Joi.object({
    nickname: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')),
    confirm: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$'))
})

router.post('/signup', async (req, res) => {
    try {
        const { nickname, password, confirm } = await signupUserSchema.validateAsync(req.body)
        console.log(nickname, password, confirm)

        if (password !== confirm) {
            return res.status(412).json({
                errorMessage: "패스워드가 일치하지 않습니다."
            })
        }
        if (password.includes(nickname)) {
            return res.status(412).json({
                errorMessage: "패스워드에 닉네임이 포함되어있습니다."
            })
        }
        const user = await User.findOne({ nickname })
        if (user) {
            return res.status(412).json({
                errorMessage: "중복된 닉네임입니다."
            })
        }
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        console.log(salt)
        console.log(password, hashedPassword)
        await User.create({ nickname, password: hashedPassword })

        res.status(200).json({
            message: "회원가입에 성공하였습니다."
        })
    } catch (err) {
        res.status(400).json({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        })
    }

})

router.post('/login', async (req, res) => {
    try {
        const { nickname, password } = req.body
        const user = await User.findOne({ nickname })
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!user || !checkPassword) {
            return res.status(412).json({
                errorMessage: "닉네임 또는 패스워드를 확인해주세요."
            })
        }
        const token = jwt.sign({ nickname }, 'token-key')
        res.cookie("Authorization", `Bearer ${token}`)
        res.status(200).json({ token })

    } catch (err) {
        return res.status(400).json({
            errorMessage: "로그인에 실패하였습니다."
        })
    }
})

module.exports = router