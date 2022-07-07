const  bookModel = require("../models/bookModel");
const  userModel = require("../models/userModel")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passValidator = require('password-validator')

const validPwd = (Password) => {
    if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)) {
      return false
    } else {
      return true;
    }
  };

const validEmail = (Email) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email)) {
      return false
    } else {
      return true;
    }
};
  
const  isValidBody = (object) => {
    if (Object.keys(object).length > 0) {
      return false
    } else {
      return true;
    }
}



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string") 
      return true;
  };

  const isvalidRequest = function (requestBody) {
    return Object.keys(requestBody).length > 0
  }
  


let createUser = async function (req,res){
    try{
    let user = req.body
    if(!isvalidRequest(user))return res.status(400).send({ status:false, message:"please provide required details"  })

    let titleEnum = ['Mr', 'Mrs', 'Miss']

    if (!titleEnum.includes(user.title)) {
        return res.status(400).send({ status: false, msg: "title should be Mr, Mrs or Miss" })
    }
    // if(!user.name)return res.status(400).send({ msg: " Name is required " })
    if(!isValid(user.name))return res.status(400).send({ status:false, message:"please provide  Name in string format"  })
    if((/\d/g.test(user.name)))return res.status(400).send({ status: false, message: "Number is not allowed in name" })
    // let f =user.name
    //     let pattern = /\d/g;
    //     let result = f.match(pattern);
    //     console.log(result)
    //     if (result != null) { return res.status(400).send({ msg: "name can not be number" }) }


    // if(!user.phone)return res.status(400).send({ msg: " PhoneNo name is required " })
    if(!isValid(user.phone))return res.status(400).send({ status:false, message:"please provide  phone in string format"  })
    if(!(/^[6-9]{1}[0-9]{9}$/.test(user.phone)))  return res.status(400).send({ status: false, message: "Phone No is invalid. +91 is not required" })
    let mobileNo = await userModel.findOne({phone : user.phone})
      if (mobileNo)return res.status(400).send({status:false, message:"this number already exist"})

      console.log(user.email)

      if(!user.email)return res.status(400).send({ msg: " Email name is required " })
    if(!isValid(user.email))return res.status(400).send({ status:false, message:"please provide  email in string format"  })

      if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(user.email))) return res.status(400).send({ status: false, message: "email Id is invalid" })
      let emailId = await userModel.findOne({email : user.email})
    if(emailId)return res.status(400).send({status:false, message:"this EmailId already exist"})
    

    if(!user.password)return res.status(400).send({ msg: " Password name is required " })
    if(!isValid(user.password))return res.status(400).send({ status:false, message:"please provide  password in string format"  })
    const schema = new passValidator();
    schema.is().min(8)
    if (!schema.validate(user.password)) {
        return res.status(400).send({ status: false, msg: "minimum length of password should be 8 characters" })
    }
    schema.is().max(15)
    if (!schema.validate(user.password)) {
        return res.status(400).send({ status: false, msg: "max length of password should be 15 characters" })
    }
    schema.has().not().spaces()
    if (!schema.validate(user.password)) {
        return res.status(400).send({ status: false, msg: "space not allowed in password" })
    }

// if(!isValid(user.address))return res.status(400).send({status:false,message:"provide address in string format"})

    let userCreated = await userModel.create(user)

    res.status(201).send({status:true, data: userCreated })
    }catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}

const userLogin = async function (req, res) {
    try {
        let data = req.body;
        
        if(isValidBody(data)){
            return res.status(400).send({status:false,message: "enter user details"});  
        }
        if(!data.Email){
            return res.status(400).send({status:false,message: "email id is required "});
        }
        if (!data.Password){
            return res.status(400).send({status:false,message: "passward is required "});
        }
        
    if (validEmail(data.Email)) {
        return res.status(400).send({ status: false, message: "Enter a valid email-id" });
      }
      
    if (validPwd(data.password)) {
        return res.status(400).send({ status: false, message: "Enter a valid password" });
      }
      const checkValidUser = await User.findOne({ email: data.email });

    if (!checkValidUser) {
      return res.status(401).send({ status: false, message: "Email Id is not correct " });
    }
    
    let checkPassword = await bcrypt.compare(data.password, checkValidUser.password);

    if (!checkPassword) {
      return res.status(401).send({ status: false, message: "Password is not correct" });
    }
    
    let checkpassword = await bcrypt.compare(data.password, checkValidUser.password);

    if (!checkpassword) {
      return res.status(401).send({ status: false, message: "Password is not correct" });
    }

    let token = jwt.sign({ userId: checkValidUser._id }, "Books-Management", {expiresIn: '1d'});

    

    res.setHeader('x-api-key', token);

    res.status(200).send({ status: true, message: "Successfully Login", data: token });


        
    } catch (error) {
        res.status(500).send({status: false,message: error.message});
    }


        
    }
    module.exports = { createUser, userLogin };







