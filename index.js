require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./database/connectDB")
const RequestLogger = require("./middlewares/logger")
const errorhandler = require("./middlewares/errorHandler")

const ArticleRoutes = require("./routes/article.route")

const app = express()
const PORT = process.env.PORT 

connectDB();

app.use(express.json())
app.use(RequestLogger)
app.use(errorhandler)
app.use(cors())
app.use("/api", ArticleRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})