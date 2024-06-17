const express = require('express');
const {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
} = require('./controller');
const { authenticateAdminToken } = require('../../../middlewares/auth');
const router = express();

router.get('/admin/book/:id', authenticateAdminToken, getBook);
router.put('/admin/book/:id', authenticateAdminToken, updateBook);
router.delete('/admin/book/:id', authenticateAdminToken, deleteBook);
router.get('/admin/book', authenticateAdminToken, getBooks);
router.post('/admin/book', authenticateAdminToken, addBook);

module.exports = router;
