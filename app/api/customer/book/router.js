const express = require('express');
const {
    getBooks,
    getBook,
} = require('./controller');
const { authenticateCustomerToken } = require('../../../middlewares/auth');
const router = express();

router.get('/customer/book/:id', authenticateCustomerToken, getBook);
router.get('/customer/book', authenticateCustomerToken, getBooks);

module.exports = router;
