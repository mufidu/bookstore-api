const { StatusCodes } = require('http-status-codes');
const {
  registerAdmin,
  loginAdmin,
} = require('../../../service/sequelize/admin/auth');

const register = async (req, res, next) => {
  try {
    const result = await registerAdmin(req);

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
    const result = await loginAdmin(req);

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
