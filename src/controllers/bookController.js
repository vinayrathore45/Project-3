const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");


const ObjectId = require('mongoose').Types.ObjectId;


function isValidObjectId(id) {

  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id)
      return true;
    return false
  }
  return false
}




const isValid = function (value) {
  if (typeof (value) === "undefined" || typeof (value) === null) return false;
  // console.log(typeof(value))
  if (typeof (value) == "number") return false;
  if (typeof (value) === "string" && value.trim().length === 0) return false;
  // if(typeof (value)!= "string") return false
  return true

}

const isvalidRequest = function (requestBody) {
  return Object.keys(requestBody).length > 0
}



const createBook = async function (req, res) {
  try {

    let data = req.body;
    if (!isvalidRequest(data)) {
      return res.status(400).send({ status: false, message: "enter user details" });
    }
      
    if (!data.userId) {
      return res.status(400).send({ status: false, message: "Please provide userId" });
    }

    if (!isValid(data.userId)) return res.status(400).send({ status: false, message: "userId is not correct." })

    //=========================================================
    if (data.userId != null) {
      r = isValidObjectId(data.userId)
      // console.log(r)
      if (r == false) { return res.status(400).send({ msg: "inavalid id format" }) }
    }



    //==========================================================

   //===================authorization=================================== 

   
   console.log("DATA          ",data.userId)
    if (req.userlogedin.userId != data.userId) { return res.status(403).send("forbidden") }



 //===========================================================================


    if (!data.title) {
      return res.status(400).send({ status: false, message: "Please provide title" });
    }


    if (!isValid(data.title)) return res.status(400).send({ status: false, message: "title is not correct." })

    if (!data.excerpt) {
      return res.status(400).send({ status: false, message: "Please provide excerpt" });
    }

    if (!isValid(data.excerpt)) return res.status(400).send({ status: false, message: "excerpt is not correct." })

    if (!data.userId) {
      return res.status(400).send({ status: false, message: "Please provide userId" });
    }

    if (!isValid(data.userId)) return res.status(400).send({ status: false, message: "userId is not correct." })


    if (!data.ISBN) {
      return res.status(400).send({ status: false, message: "Please provide ISBN" });
    }


    if (!isValid(data.ISBN)) return res.status(400).send({ status: false, message: "ISBN is not correct." })


    if (!data.category) {
      return res.status(400).send({ status: false, message: "Please provide category" });
    }

    if (!isValid(data.category)) return res.status(400).send({ status: false, message: "category is not correct." })


    if (!data.subcategory) {
      return res.status(400).send({ status: false, message: "Please provide subcategory" });
    }
    if (data.subcategory != null) { //bcoz not required true

      if (typeof (data.subcategory) == "object") {
        if (data.subcategory.length == 0) {
          return res.status(400).send({ msg: "subcategory should not be empty" })
        }
        console.log("len", data.subcategory.length)
        for (i = 0; i < data.subcategory.length; i++) {
          if (typeof (data.subcategory[i]) != "string") {
            return res.status(400).send({ msg: "subcategory should be array of string" })
          } console.log(data.subcategory, "vinay")
          if (data.subcategory[i].toString().trim().length == 0) {
            console.log("In Trim")
            return res.status(400).send({ msg: " subcategory should not be blank after trim" })
          }
        }
      } else {
        if (typeof (data.subcategory) != "string") {
          return res.status(400).send({ msg: "tags should be string " })
        }
        if (data.subcategory.trim().length == 0) {
          return res.status(400).send({ msg: " tags should not be blank" })
        }
      }
    }

    //if (!isValid(data.subcategory)) return res.status(400).send({ status: false, message: "subcategory is not correct." })

    if (!data.releasedAt) {
      return res.status(400).send({ status: false, message: "Please provide releasedDate" });
    }


    if (!isValid(data.releasedAt)) return res.status(400).send({ status: false, message: "releasedAt is not correct." })


    const dateRegex = /^(18|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/.test(data.releasedAt);
    if (!dateRegex) {
      return res.status(400).send({ status: false, message: "Please provide valid date in this formate YYYY-MM-DD" });
    }


    // //=========================================================
    // if (data.userId != null) {
    //   r = isValidObjectId(data.userId)
    //   // console.log(r)
    //   if (r == false) { return res.status(400).send({ msg: "inavalid id format" }) }
    // }



    // //==========================================================

    let checkTitle = await bookModel.findOne({ title: data.title });
    if (checkTitle) {
      return res.status(400).send({ status: false, message: " already exist use different title of book" });
    }

    const ISBNRegex = /^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(data.ISBN);
    if (!ISBNRegex) {
      return res.status(400).send({ status: false, message: "Please provide valid ISBN format" });
    }


    // let checkTitle = await bookModel.findOne({ title: data.title });
    // if (checkTitle) {
    //   return res.status(400).send({ status: false, message: " already exist use different title of book" });
    // }

    let checkISBN = await bookModel.findOne({ ISBN: data.ISBN });
    if (checkISBN) {
      return res.status(400).send({ status: false, message: "already exist use different ISBN" });
    }


    let checkUserId = await userModel.findOne({ _id: data.userId });
    if (!checkUserId) {
      return res.status(404).send({ status: false, message: `user not found` });
    }

    let bookCreated = await bookModel.create(data);
    res.status(201).send({ status: true, message: "success", data: bookCreated });
  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}



const getBook = async function (req, res) {

  try {
    let query = req.query;

    query.isDeleted = false

    //=========================================================
    if (query.userId != null) {
      r = isValidObjectId(query.userId)
      // console.log(r)
      if (r == false) { return res.status(400).send({ msg: "inavalid id format" }) }
    }

    //================================================================
    //   if (query.subcategory != null) { //bcoz not required true

    //     if (typeof (query.subcategory) == "object") {
    //         if (query.subcategory.length == 0) {
    //             return res.status(400).send({ msg: "subcategory should not be empty" })
    //         }
    //         console.log("len",query.subcategory.length)
    //         for (i = 0; i < query.subcategory.length; i++) {
    //             if (typeof (query.subcategory[i]) != "string") {
    //                 return res.status(400).send({ msg: "subcategory should be array of string" })
    //             } console.log(query.subcategory,"vinay")
    //             if (query.subcategory[i].toString().trim().length == 0) {
    //                 console.log("In Trim")
    //                 return res.status(400).send({ msg: " subcategory should not be blank after trim" })
    //             }
    //         }
    //     } else {
    //         if (typeof (query.subcategory) != "string") {
    //             return res.status(400).send({ msg: "tags should be string " })
    //         }
    //         if (query.subcategory.trim().length == 0) {
    //             return res.status(400).send({ msg: " tags should not be blank" })
    //         }
    //     }
    // }
    //===============================================================
    // if (!data.category) {
    //   return res.status(400).send({ status: false, message: "Please provide category" });
    // }
    if (query.category != null) {
      if (!isValid(query.category)) return res.status(400).send({ status: false, message: "category is not correct." })
    }

    if (query.subcategory != null) {
      if (!isValid(query.subcategory)) return res.status(400).send({ status: false, message: "subcategory is not correct." })
    }

    //==========================================================



    let findBook = await bookModel.find(query).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, }).sort({ title: 1 });
    console.log(findBook)

    if (findBook.length == 0) {
      return res.status(404).send({ status: false, message: "Book not found" });
    }
    return res.status(200).send({ status: true, message: "Success", data: findBook });
  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

//==============================================getBOOK  BY ID=======================================//



const getBooksById = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    if (!isValidObjectId(bookId)) {
      return res.status(400).send({ status: false, msg: "invalid bookId" })
    }
    // if (Object.keys(bookId).length === 0) {
    //     return res.status(400).send({ status: false, message: "book id is not present" })
    // }



    const foundedBook = await bookModel.findOne({ _id: bookId ,isDeleted:false}).select({ __v: 0 })
    console.log(foundedBook)

    if (!foundedBook) {
      return res.status(404).send({ status: false, message: "book not found" })
    }
    const availableReviews = await reviewModel.find({ bookId: foundedBook._id, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updateAt: 0, __v: 0 })
    //console.log("ghjk",availableReviews)

    foundedBook._doc["reviewData"] = availableReviews
    //foundedBook.reviewData= "availableReviews"
    console.log("hjyhvh", foundedBook)
    return res.status(200).send({ status: true, message: "Books list", data: foundedBook })


  } catch (error) { res.status(500).send({ msg: error.message }) }
}












////===========================//======================updateBook API==========================//====================////


const updateBook = async function (req, res) {
  let bookId = req.params.bookId
  //  console.log(bookId)

  if (bookId != null) {
    r = isValidObjectId(bookId)
    // console.log(r)
    if (r == false) { return res.status(400).send({ msg: "inavalid id format" }) }
  }

  //==================================================





  const user = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ _id: 0, userId: 1 })
  if (user == null) return res.status(404).send({ status: false, message: "no such book" })
  console.log(user)
  console.log(req.userlogedin)

  if (req.userlogedin.userId != user.userId) { return res.status(403).send("forbidden") }

  //====================================================


  let body = req.body
  if (!isvalidRequest(body)) {
    return res.status(400).send({ status: false, message: "enter user details" });
  }

  let title = body.title
  if (title != null) {
    if (!isValid(title)) return res.status(400).send({ status: false, message: "title is not correct." })
  }


  let excerpt = body.excerpt
  if (excerpt != null) {
    if (!isValid(excerpt)) return res.status(400).send({ status: false, message: " excrept is not correct." })
  }


  let releasedAt = body.releasedAt
  if (releasedAt != null) {
    if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: "releasedAt is not correct." })
    const dateRegex = /^(18|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/.test(releasedAt);
    if (!dateRegex) {
      return res.status(400).send({ status: false, message: "Please provide valid date in this formate YYYY-MM-DD" });
    }
  }

  let ISBN = body.ISBN
  if (ISBN != null) {
    if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN is not correct." })
    const ISBNRegex = /^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN);
    if (!ISBNRegex) {
      return res.status(400).send({ status: false, message: "Please provide valid ISBN format" });
    }
  }

  let checkUnique = await bookModel.find({ $or: [{ title: title }, { ISBN: ISBN }] })
  if (checkUnique.length != 0) return res.status(400).send({ status: false, message: " title or ISBN is already present in DB" })

  let updateBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: body }, { new: true })
  if (!updateBook) return res.status(404).send({ status: false, message: "No such book present" })
  return res.status(200).send({ status: true, message: "Success", data: updateBook })


}
//================================DELETE API==============================================//

const deleteBook = async function (req, res) {
  try {
    //console.log("hi");
    const bookId = req.params.bookId;




    //=========================================================
    if (bookId != null) {
      r = isValidObjectId(bookId)
      // console.log(r)
      if (r == false) { return res.status(400).send({ msg: "inavalid id format" }) }
    }



    //==========================authorization==================

    const user = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ _id: 0, userId: 1 })
    if (user == null) return res.status(404).send({ status: false, message: "no such book" })
    console.log(user)
    console.log(req.userlogedin)

    if (req.userlogedin.userId != user.userId) { return res.status(403).send("forbidden") }







    //=====================================================


    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    //console.log(book);

    // check Book
    if (!book) {
      return res.status(404).send({ status: false, message: "No such book exists" });
    }
    //   if (book.isDeleted == true) {
    //      return res.status(404).send({ status: false, message: "Book not found or has already been deleted" })
    //   }

    await bookModel.updateOne({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } });
    //   await Review.updateMany({bookId: bookId}, { isDeleted: true })
    return res.status(200).send({ status: true, message: "Book deleted successfully" });
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message })
  }
}






module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.getBooksById = getBooksById
module.exports.deleteBook = deleteBook
module.exports.updateBook = updateBook