const { StatusCodes } = require('http-status-codes');
const {
    getAllBooks,
    getBookById,
} = require('../../../service/sequelize/customer/book');

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
};

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

module.exports = {
    getBooks,
    getBook,
};
