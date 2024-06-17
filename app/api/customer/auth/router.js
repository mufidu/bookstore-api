const express = require('express');
const {
  register,
  login,
} = require('./controller');
const router = express();

router.post('/customer/auth/register', register);
router.post('/customer/auth/login', login);

module.exports = router;
