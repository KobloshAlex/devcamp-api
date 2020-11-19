const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connect = require("./config/db");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const app = express();

//env config
dotenv.config({ path: "./config/config.env" });

//connect to Mongo
connect();

//Route files
const bootcampRouter = require("./routes/bootcampsRouter");
const coursesRouter = require("./routes/coursesRouter");
const authRouter = require("./routes/authRouter");

//body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//logger
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

//file upload
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//mount routers
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/auth", authRouter);

//errorhandler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running on PORT ${process.env.PORT}`));
