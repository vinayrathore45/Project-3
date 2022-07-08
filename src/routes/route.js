const express = require('express');
const { createUser, userLogin } = require('../controllers/userController');
const BookController = require('../controllers/bookController')
const MW = require("../middleware/auth")
const reviewController = require('../controllers/reviewController')
const router = express.Router();


router.post('/register', createUser);
router.post('/login', userLogin);
router.post('/books',MW.authentication,BookController.createBook) 
router.get('/books',MW.authentication,BookController.getBook)
router.delete('/books/:bookId',BookController.deleteBook)
router.put('/books/:bookId',MW.authentication,BookController.updateBook)
router.post('/books/:bookId/review', reviewController.createReview)


module.exports = router