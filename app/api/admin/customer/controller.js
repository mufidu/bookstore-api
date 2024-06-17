const { StatusCodes } = require('http-status-codes');
const {
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
} = require('../../../service/sequelize/admin/customer');

const getCustomers = async (req, res, next) => {
  try {
    const result = await getAllCustomers();

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

const getCustomer = async (req, res, next) => {
  try {
    const result = await getCustomerById(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

const updateCustomer = async (req, res, next) => {
  try {
    const result = await updateCustomerById(req);

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
  getCustomers,
  getCustomer,
  updateCustomer,
};
