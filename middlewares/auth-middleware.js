const jwt = require('jsonwebtoken')
const User = require('../schemas/user')

module.exports = async (req, res, next) => {
    console.log(req.cookies)
    if(!req.cookies){
        console.log(req.cookies)
        return res.status(403).json({
            errorMessage:"로그인이 필요한 기능입니다."
        })
    }
    // 쿠키에서  authorization 을 가져옴
    const { Authorization } = req.cookies
    console.log(req.cookies)
    // Bearer asdfwfsdf.sdfasfeaf.sdfasefasdf
    // undefined.
    // authorization 쿠키가 존재하지 않았을때를 대비

    // null 병합 문자열. 왼쪽값이 비었거나 null 이면 오른쪽값으로 대체
    const [authType, authToken] = (Authorization ?? "").split(" ")

    // authType === Bearer 값인지 확인
    // authToken 검증

    if (authType !== "Bearer" || !authToken) {
        res.status(403).json({
            errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."
        })
        return
    }


    // authToken 이 만료되었는지 확인
    // authToken이 서버가 발급한 토큰이 맞는지 검증
    // authToken 에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인

    // jwt 검증
    try {
        const { nickname } = jwt.verify(authToken, process.env.Token_key)
        const user = await User.findOne({nickname})
        res.locals.user = user

        next() // 다음 미들웨어로

    } catch (err) {
        console.error(err)
        res.status(400).json({
            errorMessage: "로그인이 필요한 기능입니다"
        })
        return
    }

}