/*
@desc       Get all bootcamps
@route      GET /api/v1/bootcamps
@access     public
*/
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Show all bootcamps"});
}

/*
@desc       Get one bootcamp by id
@route      GET /api/v1/bootcamps/:id
@access     public
*/
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Show bootcamp by id " + req.params.id});
}

/*
@desc       Create  bootcamp
@route      POST /api/v1/bootcamps
@access     private
*/
exports.creatBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Create bootcamp"});
}

/*
@desc       Update bootcamp
@route      PUT /api/v1/bootcamps
@access     private
*/
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Update bootcamp by id " + req.params.id});
}
/*
@desc       delete bootcamp by id
@route      DELETE /api/v1/bootcamps
@access     private
*/
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Delete bootcamp by id " + req.params.id});
}