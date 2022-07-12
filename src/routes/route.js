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
router.get('/books/:bookId',MW.authentication,BookController.getBooksById)
router.delete('/books/:bookId',MW.authentication,BookController.deleteBook)
router.put('/books/:bookId',MW.authentication,BookController.updateBook)
router.post('/books/:bookId/review', reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)


router.all("/*",function(req,res){
    res.status(400).send({
        status:false,msg:"The endpoint is not correct"
    });
});


module.exports = router