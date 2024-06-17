const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const errorHandlerMiddleware = require('./app/middlewares/handle-error');
const notFoundMiddleware = require('./app/middlewares/not-found');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        msg: 'Welcome to API',
        data: {},
    });
});

const customerRoutes = {
    auth: require('./app/api/customer/auth/router'),
};

Object.values(customerRoutes).forEach(route => app.use('/api', route));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
