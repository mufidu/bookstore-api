const { StatusCodes } = require('http-status-codes');
const {
    getCustomerProfile,
    updateCustomerProfile,
} = require('../../../service/sequelize/customer/profile');

const getProfile = async (req, res, next) => {
    try {
        const result = await getCustomerProfile(req);

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const result = await updateCustomerProfile(req);

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
    getProfile,
    updateProfile,
};
