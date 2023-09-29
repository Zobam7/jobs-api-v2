const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
    const jobs = await Job.find().sort("-createdAt")
    res.status(StatusCodes.OK).json({ jobs, nbHits: jobs.length})
}

const getUserJobs = async (req, res) => {
    const { jobtype, role, company } = req.query
    const { userId } = req.user
    const queryObject = {
        createdBy: userId,
    }
    if(jobtype){
        queryObject.jobtype = { $regex: jobtype, $options: 'i'}
    }

    if(role){
        queryObject.role = { $regex: role, $options: 'i'}
    }

    if(role){
        queryObject.company = { $regex: company, $options: 'i'}
    }
    
    const result = await Job.find(queryObject).sort("-createdAt")

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const nextPage = (page - 1) * limit

    const paginatedResults = result.skip(nextPage).limit(limit)
    const jobs = await paginatedResults
    res.status(StatusCodes.OK).json({ jobs, nbHits: jobs.length })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job  = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const getUserSingleJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }} = req
    const job = await Job.findOne({ createdBy: userId, _id: jobId})
    if(!job){
        throw new NotFoundError(`Job with id: ${jobId} not found`)
    }
    res.status(StatusCodes.OK).json({ job })
}


const updateJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }} = req
    const job = await Job.findOneAndUpdate({ createdBy: userId, _id: jobId}, req.body, {new: true, runValidators: true})
    if(!job){
        throw new NotFoundError(`Job with id: ${jobId} not found`)
    }

    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }} = req
    const job = await Job.findByIdAndRemove({ createdBy: userId, _id: jobId })
    if(!job){
        throw new NotFoundError(`Job with id: ${jobId} not found`)
    }

    res.status(StatusCodes.OK).send()
}

module.exports = {
    getUserJobs,
    getUserSingleJob,
    createJob,
    updateJob,
    deleteJob,
    getAllJobs
}