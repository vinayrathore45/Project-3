const express = require('express');
const { createUser, userLogin } = require('../controllers/userController');
const BookController = require('../controllers/bookController')
const router = express.Router();


//router.post('/register', createUser);
//router.post('/login', userLogin);
router.post('/books',BookController.createBook) 

module.exports = router