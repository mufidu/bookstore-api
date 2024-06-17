const { BadRequestError, NotFoundError } = require('../../../errors');
const { sequelize } = require('../../../../models');
const validator = require('validator');
const Customer = require('../../../../models').Customer;
const config = require('../../../../config/environment-config');
config.loadEnvironmentVariables();

const getAllCustomers = async () => {
    const customers = await Customer.findAll();
    return customers;
}

const getCustomerById = async (req) => {
    const { id } = req.params;
    console.log(id);
    const customer = await Customer.findByPk(id);
    if (!customer) {
        throw new NotFoundError('Customer not found');
    }
    return customer;
}

const updateCustomerById = async (req) => {
    const { id } = req.params;
    const { fullName, email } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
        throw new NotFoundError('Customer not found');
    }

    // Validate email
    const isEmail = await validator.isEmail(email);
    if (!isEmail) {
        throw new BadRequestError('Invalid Email');
    }

    const result = await sequelize.transaction(async (t) => {
        const updatedCustomer = await Customer.update(
            {
                fullName: fullName,
                email: email,
            },
            {
                where: { id },
                returning: true,
                plain: true,
                transaction: t,
            }
        );

        return updatedCustomer[1].dataValues;
    });

    return result;
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    updateCustomerById,
};