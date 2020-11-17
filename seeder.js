const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config/config.env" });

//load model
const Bootcamp = require("./model/Bootcamp");

//load DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

//read JSON files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

//Inports into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
        console.log("Data inported...".green.inverse);
        process.exit();
	} catch (err) {
		console.log(err);
	}
};

//Delete Data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
        console.log("Data destroyed...".red.inverse);
        process.exit();
	} catch (err) {
		console.log(err);
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
