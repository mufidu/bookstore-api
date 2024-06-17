const express = require('express');
const {
    checkoutOrder,
    handlePayment,
} = require('./controller');
const { authenticateCustomerToken } = require('../../../middlewares/auth');
const router = express();

router.post('/customer/order/checkout', authenticateCustomerToken, checkoutOrder);
router.post('/customer/order/payment', handlePayment);

module.exports = router;
