const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const route = require('./routes/route.js');

const app = express();
const multer= require("multer");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())

mongoose.connect("mongodb+srv://Shrikant:shreyushri@cluster0.xjishte.mongodb.net/group74DB", {
    useNewUrlParser: true
})
.then(() => { console.log('Connected to MongoDB') })
.catch(err => { console.log('Error connecting to MongoDB: ' + err) });

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});