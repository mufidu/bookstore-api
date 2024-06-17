const express = require('express');
const {
    getCustCart,
    addBook,
    removeBook,
} = require('./controller');
const { authenticateCustomerToken } = require('../../../middlewares/auth');
const router = express();

router.get('/customer/cart', authenticateCustomerToken, getCustCart);
router.post('/customer/cart', authenticateCustomerToken, addBook);
router.delete('/customer/cart', authenticateCustomerToken, removeBook);

module.exports = router;
