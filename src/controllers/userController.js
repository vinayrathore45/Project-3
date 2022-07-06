const  bookModel = require("../models/bookModel");
const  userModel = require("../models/userModel")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


let createUser = async function (req,res){
    try{
    let user = req.body

    let userCreated = await userModel.create(user)

    res.status(201).send({status:true, data: authorCreated })
    }catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}




















































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







