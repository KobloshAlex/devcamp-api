const express = require("express");
const dotenv = require("dotenv");
const bootcampRouter = require("./routes/bootcampsRouter");
const morgan = require("morgan");
const app = express();
//env config
dotenv.config({ path: "./config/config.env" });
//logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//use controller
app.use("/api/v1/bootcamps", bootcampRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running on PORT ${process.env.PORT}`));
