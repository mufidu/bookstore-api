const express = require('express');
const {
    getProfile,
    updateProfile,
} = require('./controller');
const { authenticateCustomerToken } = require('../../../middlewares/auth');
const router = express();

router.get('/customer/profile', authenticateCustomerToken, getProfile);
router.put('/customer/profile', authenticateCustomerToken, updateProfile);

module.exports = router;
