const express = require('express');
const {
  register,
  login,
} = require('./controller');
const router = express();

router.post('/admin/auth/register', register);
router.post('/admin/auth/login', login);

module.exports = router;
