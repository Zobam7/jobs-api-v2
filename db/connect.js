const mongoose = require("mongoose")

const connectDB = (url) => {
    try {
        mongoose.connect(url)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB