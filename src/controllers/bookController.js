const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
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
    console.log(typeof(value))
    if (typeof (value) == "number" ) return false;
    if (typeof (value) === "string" && value.trim().length === 0) return false;
   // if(typeof (value)!= "string") return false
    return true

}

const isvalidRequest = function (requestBody) {
  return Object.keys(requestBody).length > 0
}



const createBook = async function (req, res) {
    try{
      
      let data = req.body;
      if(!isvalidRequest(data)){
        return res.status(400).send({status:false,message: "enter user details"});  
      }

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
                return res.status(400).send({ msg: "tags should not be empty" })
            }
            console.log("len",data.subcategory.length)
            for (i = 0; i < data.subcategory.length; i++) {
                if (typeof (data.subcategory[i]) != "string") {
                    return res.status(400).send({ msg: "tags should be array of string" })
                } console.log(data.subcategory,"vinay")
                if (data.subcategory[i].toString().trim().length == 0) {
                    console.log("In Trim")
                    return res.status(400).send({ msg: " tags should not be blank after trim" })
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
  
      
      const dateRegex =/^(18|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/.test(data.releasedAt);
      if (!dateRegex) {
        return res.status(400).send({ status: false, message: "Please provide valid date in this formate YYYY-MM-DD"});
      }
  
      
      if (data.userId) {
        if (mongoose.Types.ObjectId.isValid(data.userId) == false) {
          return res.status(400).send({ status: false, message: "userId Invalid" });
        }
      }
  
      
      const ISBNRegex=/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(data.ISBN);
      if (!ISBNRegex) {
        return res.status(400).send({ status: false, message: "Please provide valid ISBN format" });
      }
  

      let checkTitle = await bookModel.findOne({ title: data.title });
      if (checkTitle) {
        return res.status(400).send({status: false,message: " already exist use different title of book"});
      }
  
      let checkISBN = await bookModel.findOne({ ISBN: data.ISBN });
      if (checkISBN) {
        return res.status(400).send({status: false,message: "already exist use different ISBN" });
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
      
////===========================//======================updateBook API==========================//====================////


const updateBook = async function (req,res){
 let bookId= req.params.bookId
//  console.log(bookId)
 if (bookId!= null) {
  r = isValidObjectId(bookId)
  // console.log(r)
  if (r == false) { return res.status(400).send({ msg: "inavalid id format" }) }
}

 let body =req.body
 if(!isvalidRequest(body)){
  return res.status(400).send({status:false,message: "enter user details"});  
 }

  let title =body.title
  if (!isValid(title)) return res.status(400).send({ status: false, message: "title is not correct." })

let excerpt = body.excerpt
let releaseDate= body.releaseDate
let ISBN =body.ISBN
 
 let checkUnique= await bookModel.find({$or:[{title:title},{ISBN:ISBN}]})
 if(checkUnique.length!=0) return res.status(400).send({status:false,message:"already present in DB"})

 let updateBook = await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false},{$set:body},{new:true})
 if(!updateBook) return res.status(404).send({status:false, message:"No such book present"})
 return res.status(200).send({ status: true, message:"Success",data:updateBook  })


}


    
    module.exports.createBook =createBook
    module.exports.updateBook = updateBook