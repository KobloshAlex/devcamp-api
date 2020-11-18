const mongoose = require("mongoose");

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

module.exports = mongoose.model("Course", CousreShema);
