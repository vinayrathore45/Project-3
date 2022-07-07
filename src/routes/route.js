const express = require('express');
const { createUser, userLogin } = require('../controllers/userController');
const BookController = require('../controllers/bookController')
const MW = require("../middleware/auth")

const router = express.Router();


router.post('/register', createUser);
router.post('/login', userLogin);
router.post('/books',BookController.createBook) 
router.get('/books',BookController.getBook)
router.delete('/books/:bookId',BookController.deleteBook)
router.put('/books/:bookId',MW.authentication,BookController.updateBook)


module.exports = router