const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const ObjectId = require('mongoose').Types.ObjectId;

// const isValid = function (value) {
//     if (typeof value === "undefined" || value === null) return false;
//     if (typeof value === "string" && value.trim().length === 0) return false;
//     return true;
// };
const isValid = function (value) {
    //if (typeof (value) === "undefined" || typeof (value) === null) return false;
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
        if(!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
        console.log(bookId)

        // if (!bookId)
        //     return res.status(400).send({ status: false, msg: "Bad Request, please provide BookId in params" })

        let check = await bookModel.findOne({ _id: bookId, isDeleted: false })
        console.log(check)
        if (!check) {
            return res.status(404).send({ status: false, message: "No book found  " })
        } else {
            let data = req.body
            let { review, rating,reviewedBy } = data

            if (!isvalidRequest(data)) {
                return res.status(400).send({ status: false, msg: "please provide  details" })
            }
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, msg: "Not a valid name" })
            }

            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "Not a valid review" })
            }

            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, msg: "Rating is must  and should be in between 1-5 " })
            }

            data.reviewedAt = new Date()
            data.bookId = bookId
            let newReview = await bookModel.findOneAndUpdate({ _id: bookId },{
                $inc: {
                    reviews: 1
                }
        }, { new: true})

            let savedData = await reviewModel.create(data)
             newReview._doc["reviewData"] = savedData
            return res.status(201).send({ status: true, data:newReview  })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "error", err: error.message })

    }
}

const updateReview = async function (req, res) {
    try {
      const bookId = req.params.bookId;
      if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
      const requiredBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
      if (!requiredBook) return res.status(404).send({ status: false, message: "No Such book present" })
      const reviewId = req.params.reviewId;
      if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "invalid reviewId" })
      const requiredReview = await reviewModel.findOne({ _id: reviewId,bookId:bookId, isDeleted: false })
      if (!requiredReview) return res.status(404).send({ status: false, message: "No Such review present for that specific book" });
  
      const data = req.body
  
      const { reviewedBy, rating, review,reviewedAt } = data

      if(reviewedAt){return res.status(400).send({status:false,msg:"cant update reviewedAt"})}


  
      if (reviewedBy) {
        if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please Enter Reviewr's name" })
      }
  
      if (review) {
        if (!isValid(review)) return res.status(400).send({ status: false, message: "Please Enter Review" })
      }
  
      if (rating) {
        if (!(/^[1-5]$/).test(rating)) return res.status(400).send({ status: false, message: "Enter Rating Between 1 to 5" })
      }
      const myFilter = {
        _id: reviewId,
        isDeleted: false
      }
      const updatedReview = await reviewModel.findOneAndUpdate(myFilter, data, { new: true }).lean()
      requiredBook.reviewsData = updatedReview
      return res.status(200).send({ status: true, message: "Success", data: requiredBook })
    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
  }
  
  
  const deleteReview = async function (req, res) {
    try {
      let bookId = req.params.bookId
      if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })
       const requiredBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
       if (!requiredBook) return res.status(404).send({ status: false, message: "No Such book present" })
       const reviewId = req.params.reviewId;
      if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "invalid reviewId" })
      const requiredReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })

   if (!requiredReview) return res.status(404).send({ status: false, message: "No Such review present" });
  
      
      const deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId,bookId:bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
      if(!deletedReview){return res.status(404).send({msg:"no such review exist of tha book"})}
      //const totalReview = await reviewModel.find({ bookId: bookId, isDeleted: false})
      
      //console.log(totalReview,"  tr       ")
      const book = await bookModel.findOneAndUpdate({ _id: bookId }, {$inc: {
        reviews: -1
    }
}, { new: true})
      return res.status(200).send({ status: true, message: "The review has been Deleted" })
    } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
  }


module.exports.createReview= createReview

module.exports.updateReview= updateReview

module.exports.deleteReview= deleteReview
