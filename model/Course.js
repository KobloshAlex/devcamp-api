const mongoose = require("mongoose");
const Bootcamp = require("./Bootcamp");

const CousreShema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please add course title"],
	},
	description: {
		type: String,
		required: [true, "Please add description"],
	},
	weeks: {
		type: String,
		required: [true, "Please add number of weeks"],
	},
	tuition: {
		type: Number,
		required: [true, "Please add tuition cost"],
	},
	minimumSkill: {
		type: String,
		required: [true, "Please add title"],
		enum: ["beginner", "intermediate", "advance"],
	},
	sholarshipAvaliable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: "Bootcamp",
		required: true,
	},
});

//sttic mthod to get avg of courses
CousreShema.statics.getAvarageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: "$bootcamp",
				averageCost: { $avg: "$tuition" },
			},
		},
	]);

	try {
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (err) {
        console.log(err);
    }
};

// call getAvarageCost after save
CousreShema.post("save", function () {
	this.constructor.getAvarageCost(this.bootcamp);
});

// call getAvarageCost after remove
CousreShema.pre("remove", function () {
	this.constructor.getAvarageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CousreShema);
