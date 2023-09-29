const mongoose = require('mongoose')

const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide a company name"],
    },
    role: {
        type: String,
        required: [true, "Please provide a role"],
    },
    salary: {
        type: String,
        default: "Not available"
    },
    jobtype: {
        type: String,
        enums: {
            values: ['full time', 'part time', 'contract', 'volunteer', 'intern'],
            message: '{VALUE} is not supported'
        }
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide a user"]
    }

}, {timestamps: true})

module.exports = mongoose.model("Job", JobSchema)