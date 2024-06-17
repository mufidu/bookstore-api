const { StatusCodes } = require('http-status-codes');
const {
    getCart,
    addBookToCart,
    removeBookFromCart,
} = require('../../../service/sequelize/customer/cart');

const getCustCart = async (req, res, next) => {
    try {
        const result = await getCart(req);

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const addBook = async (req, res, next) => {
    try {
        const result = await addBookToCart(req);

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

const removeBook = async (req, res, next) => {
    try {
        const result = await removeBookFromCart(req);

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
    getCustCart,
    addBook,
    removeBook,
};
