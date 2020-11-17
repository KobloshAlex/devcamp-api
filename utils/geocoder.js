const NodeGeocoder = require("node-geocoder");
const dotenv = require("dotenv");

dotenv.config({
    path: "./config/config.env"
});

const options = {
	provider: process.env.GEOCODER_PROVIDER,
	httpAdapter: "https",
	apiKey: process.env.GEOCODDER_API_KEY,
	formater: null,
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder