const { sequelize } = require('../../../../models');
const validator = require('validator');
const Customer = require('../../../../models').Customer;
const config = require('../../../../config/environment-config');
config.loadEnvironmentVariables();

const getCustomerProfile = async (req) => {
    const { username } = req.user.customer;

    const customer = await Customer.findOne({ where: { username } });
    if (!customer) {
        throw new NotFoundError('Customer not found');
    }

    return customer;
};

const updateCustomerProfile = async (req) => {
    const { username } = req.user.customer;
    const { fullName, email, newUsername } = req.body;

    const customer = await Customer.findOne({ where: { username } });
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
                username: newUsername,
            },
            {
                where: { username },
                returning: true,
                plain: true,
                transaction: t,
            }
        );

        return updatedCustomer[1].dataValues;
    });

    return result;
};

module.exports = {
    getCustomerProfile,
    updateCustomerProfile,
};