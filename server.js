const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connect = require('./config/db');
const errorHandler = require("./middleware/errorHandler")
const app = express();

//env config
dotenv.config({ path: "./config/config.env" });

//connect to Mongo
connect();

//Route files
const bootcampRouter = require("./routes/bootcampsRouter");
const coursesRouter = require("./routes/coursesRouter");

//body parser
app.use(express.json());

//logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//mount routers
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", coursesRouter);

//errorhandler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running on PORT ${process.env.PORT}`));
