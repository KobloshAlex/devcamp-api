const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connect = require('./config/db');
const bootcampRouter = require("./routes/bootcampsRouter");
const errorHandler = require("./middleware/errorHandler")
const app = express();
//env config
dotenv.config({ path: "./config/config.env" });
//connect to Mongo
connect();
//body parser
app.use(express.json());

//logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//use controller
app.use("/api/v1/bootcamps", bootcampRouter);

//errorhandler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running on PORT ${process.env.PORT}`));
