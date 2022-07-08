const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");

// const isValid = function (value) {
//     if (typeof value === "undefined" || value === null) return false;
//     if (typeof value === "string" && value.trim().length === 0) return false;
//     return true;
// };
const isValid = function (value) {
    if (typeof (value) === "undefined" || typeof (value) === null) return false;
    // console.log(typeof(value))
    if (typeof (value) == "number" ) return false;
    if (typeof (value) === "string" && value.trim().length === 0) return false;
   // if(typeof (value)!= "string") return false
    return true

}


function isValidObjectId(id) {

    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false
    }
    return false
  }

  const isvalidRequest = function (requestBody) {
    return Object.keys(requestBody).length > 0
  }
  

  




const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        console.log(bookId)

        if (!bookId)
            return res.status(400).send({ status: false, msg: "Bad Request, please provide BookId in params" })

        let check = await bookModel.findOne({ _id: bookId, isDeleted: false })
        console.log(check)
        if (!check) {
            return res.status(404).send({ status: false, message: "No book found bhai " })
        } else {
            let data = req.body
            let { review, rating } = data

            if (!isvalidRequest(data)) {
                return res.status(400).send({ status: false, msg: "please provide  details" })
            }

            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "Not a valid review" })
            }
            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, msg: "Rating is must  and should be in between 1-5 " })
            }

            data.reviewedAt = new Date()
            data.bookId = bookId
            let newReview = await bookModel.findOneAndUpdate({ _id: bookId }, {
                $inc: {
                    review: 1
                },
            }, { new: true, upsert: true })

            let savedData = await reviewModel.create(data)
            newReview._doc["reviewData"] = savedData
            return res.status(201).send({ status: true, data: newReview })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "error", err: error.message })

    }
}

module.exports.createReview= createReview