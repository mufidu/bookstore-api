const validator = require('validator');
const { BadRequestError, NotFoundError } = require('../../../errors');
const { sequelize } = require('../../../../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const Customer = require('../../../../models').Customer;
const config = require('../../../../config/environment-config');
config.loadEnvironmentVariables();

const registerCustomer = async (req) => {
    const { username, password, fullName, email } = req.body;

    if (!username || !password) {
        throw new BadRequestError('Username and password is required');
    }

    // Check if username exists in PostgreSQL database
    const customer = await Customer.findOne({ where: { username } });
    if (customer) {
        throw new BadRequestError('Username already exists');
    }

    // Validate username
    const isUsername = await validator.isAlphanumeric(username);
    if (!isUsername) {
        throw new BadRequestError('Invalid Username');
    }

    // Validate email
    const isEmail = await validator.isEmail(email);
    if (!isEmail) {
        throw new BadRequestError('Invalid Email');
    }

    // Validate password
    const strongPassword = await validator.isStrongPassword(password);
    if (!strongPassword) {
        throw new BadRequestError('Weak Password');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await sequelize.transaction(async (t) => {
        const sequelizeCustomer = await Customer.create(
            {
                username: username,
                password: hashedPassword,
                fullName: fullName,
                email: email,
            },
            {
                transaction: t,
            }
        );
        return sequelizeCustomer;
    });

    return result;
};

const loginCustomer = async (req) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError('Username and password is required');
    }

    const customer = await Customer.findOne({ where: { username } });
    if (!customer) {
        throw new NotFoundError('Customer not found');
    }

    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
        throw new BadRequestError('Incorrect password');
    }

    // Customer is authenticated, generate a JWT
    const token = jwt.sign({ customer: customer },
        process.env.JWT_SECRET_KEY,
        { expiresIn: parseInt(process.env.JWT_EXPIRATION, 10) });

    return { customer, token };
}

module.exports = {
    registerCustomer,
    loginCustomer,
};
