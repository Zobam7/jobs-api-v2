const { UnauthenticatedError } = require("../errors")
const jwt = require("jsonwebtoken")


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError("You have to be authenticated")
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId, username: payload.username}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication invalid")
    }
}

module.exports = auth