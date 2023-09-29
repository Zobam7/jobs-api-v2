const { StatusCodes } = require("http-status-codes")
const {CustomAPIError} = require("../errors")

const errorHandlerMiddleware = async (err, req, res, next) => {
    let customError = {
        // default error
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || `Something went wrong, please try again later`
    }


    if(err.name === "ValidationError"){
        customError.message = Object.values(err.errors).map(err => err.message).join(", ")
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if(err.code === 11000){
        customError.message = `${Object.keys(err.keyValue)} already exists`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if(err.name === "CastError"){
        customError.message = `No item found for id: ${err.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }



    return res.status(customError.statusCode).json({message: customError.message})
}

module.exports = errorHandlerMiddleware