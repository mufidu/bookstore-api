const { StatusCodes } = require('http-status-codes');
const {
  registerCustomer,
  loginCustomer,
} = require('../../../service/sequelize/customer/auth');

const register = async (req, res, next) => {
  try {
    const result = await registerCustomer(req);

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginCustomer(req);

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
  register,
  login,
};
