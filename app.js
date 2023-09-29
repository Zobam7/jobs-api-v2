require("dotenv").config()
require("express-async-errors")
const connectDB = require("./db/connect")
const authRouter = require("./routers/auth")
const jobRouter = require("./routers/jobs")
const alljobs = require("./routers/alljobs")
const errorHandlerMiddleware = require("./middleware/error-handler")
const notFoundMiddleware = require("./middleware/not-found")
const authenticationUser = require("./middleware/authentication")

// security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

// swagger
const swaggerUI = require("swagger-ui-express")
const YAML =  require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml")


const express = require("express")
const app = express()

app.set("trust proxy", 1)
app.set(rateLimiter, ({
    windowMs: 15 * 60 * 1000, // 15mins
    max: 100 // limit each IP to 100 requests per windowMs
}))

//middlewares
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.get("/", (req, res) => {
    res.send("<h1>Jobs API v2</h1><a href='/api-docs'>API Documentation</a>")
})

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/alljobs", alljobs)
app.use("/api/v1/jobs", authenticationUser, jobRouter)

// error handlers
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 3000

const start = async() => {
    try {
        // connect to db
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server listening on ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()