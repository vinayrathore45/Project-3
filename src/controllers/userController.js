const  bookModel = require("../models/bookModel");
const  userModel = require("../models/userModel")
const mongoose = require("mongoose")


let createUser = async function (req,res){
    try{
    let user = req.body

    let userCreated = await userModel.create(user)

    res.status(201).send({status:true, data: authorCreated })
    }catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}