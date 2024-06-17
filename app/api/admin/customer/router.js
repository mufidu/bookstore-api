const express = require('express');
const {
  getCustomers,
  getCustomer,
  updateCustomer,
} = require('./controller');
const { authenticateAdminToken } = require('../../../middlewares/auth');
const router = express();

router.get('/admin/customer/:id', authenticateAdminToken, getCustomer);
router.put('/admin/customer/:id', authenticateAdminToken, updateCustomer);
router.get('/admin/customer', authenticateAdminToken, getCustomers);

module.exports = router;
