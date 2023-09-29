const express = require("express")
const router = express.Router()


const { register, login, getAllJobs } = require("../controllers/auth")

router.route("/register").post(register)
router.route("/login").post(login)

module.exports = router