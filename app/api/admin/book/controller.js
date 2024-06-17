const { StatusCodes } = require('http-status-codes');
const {
  getAllBooks,
  getBookById,
  addNewBook,
  updateBookById,
  deleteBookById,
} = require('../../../service/sequelize/admin/book');

const getBooks = async (req, res, next) => {
  try {
    const result = await getAllBooks(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

const getBook = async (req, res, next) => {
  try {
    const result = await getBookById(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

const addBook = async (req, res, next) => {
  try {
    const result = await addNewBook(req);

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

const updateBook = async (req, res, next) => {
  try {
    const result = await updateBookById(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

const deleteBook = async (req, res, next) => {
  try {
    const result = await deleteBookById(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
};
