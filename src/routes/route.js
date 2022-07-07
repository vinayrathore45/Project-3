const express = require('express');
const { updateBook } = require('../controllers/bookController');
const { createUser, userLogin } = require('../controllers/userController');
const MW = require("../middleware/auth")

const router = express.Router();


router.post('/register', createUser);
router.post('/login', userLogin);
router.put('/books/:bookId',MW.authentication,updateBook)


module.exports = router