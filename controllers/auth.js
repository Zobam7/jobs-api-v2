const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError } = require("../errors")
const Job = require("../models/Job")


const register = async (req, res) => {
    const user = await User.create({...req.body})
    const token = await user.createJwt()
    res.status(StatusCodes.CREATED).json({user: {name: user.name, email: user.email}, token})
}

const login = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password){
        throw new BadRequestError('Please Provide email and password')
    }

    const user = await User.findOne({email})
    if(!user){
        throw new BadRequestError('Invalid email or password');
    }

    // compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new BadRequestError('Invalid email or password')
    }

    const token = await user.createJwt()
    res.status(StatusCodes.OK).json({user: {name: user.name, email: user.email}, token})
}



module.exports = {
    register,
    login,
}