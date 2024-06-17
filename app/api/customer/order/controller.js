const { StatusCodes } = require('http-status-codes');
const {
    checkout,
    paymentHandler,
} = require('../../../service/midtrans/order');

const checkoutOrder = async (req, res, next) => {
    try {
        const result = await checkout(req);

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const handlePayment = async (req, res, next) => {
    try {
        const result = await paymentHandler(req);

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
    checkoutOrder,
    handlePayment,
};
