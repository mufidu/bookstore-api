const { BadRequestError, NotFoundError } = require('../../errors');
const validator = require('validator');
const Transaction = require('../../../models').Transaction;
const Product = require('../../../models').Product;
const Enrollment = require('../../../models').Enrollment;

const midtransClient = require('midtrans-client');
const config = require('../../../config/environment-config');
config.loadEnvironmentVariables();

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SANDBOX_SERVER_KEY,
    clientKey: process.env.MIDTRANS_SANDBOX_CLIENT_KEY,
});

const checkout = async (req) => {
    const user = req.user.student;
    const { productId, fullName, email, phoneNumber } = req.body;

    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
        throw new NotFoundError('Product not found');
    }

    if (!fullName) {
        throw new BadRequestError('Full name not set');
    }
    if (!email) {
        throw new BadRequestError('Email not set');
    }
    const isEmail = await validator.isEmail(email);
    if (!isEmail) {
        throw new BadRequestError('Invalid Email');
    }
    if (!phoneNumber) {
        throw new BadRequestError('Phone number not set');
    }

    const grossAmount = parseInt(product.price);
    let totalDiscount = 0;
    if (product.discount && product.discountStart && product.discountEnd) {
        const now = new Date();
        if (now >= product.discountStart && now <= product.discountEnd) {
            totalDiscount = (grossAmount * product.discount) / 100;
        }
    }
    const serviceFee = (grossAmount * 7) / 100;

    const netAmount = grossAmount - totalDiscount + serviceFee;

    const lastTransaction = await Transaction.findOne({
        order: [['id', 'DESC']],
    });
    let invoiceNumber = "IT-CERTS-0001";
    if (lastTransaction) {
        const lastInvoiceNumber = lastTransaction.invoiceNumber;
        const lastInvoiceNumberArray = lastInvoiceNumber.split('-');
        const lastInvoiceNumberInt = parseInt(lastInvoiceNumberArray[2]);
        invoiceNumber = `IT-CERTS-${('0000' + (lastInvoiceNumberInt + 1)).slice(-4)}`;
    }

    const transaction = await Transaction.create({
        studentId: user.id,
        invoiceNumber,
        grossAmount,
        totalDiscount,
        netAmount,
        serviceFee,
        productId: productId,
        status: 'pending',
    });

    if (!transaction) {
        throw new BadRequestError('Failed to create transaction in database');
    }

    const midtrans = await core.charge({
        payment_type: 'qris',
        transaction_details: {
            gross_amount: netAmount,
            order_id: transaction.id,
        },
        customer_details: {
            full_name: fullName,
            email: email,
            phone: phoneNumber,
        },
    });

    if (midtrans.status_code !== '201') {
        transaction.status = 'failure';
        await transaction.save();
        throw new BadRequestError('Failed to create transaction in midtrans');
    } else {
        transaction.qrisString = midtrans.qr_string;
        transaction.expiryTime = midtrans.expiry_time;
        transaction.invoiceDate = midtrans.transaction_time;
        transaction.qrisURL = midtrans.actions[0].url;
        await transaction.save();
    }

    return transaction;
}

const paymentHandler = async (req) => {
    const { order_id, transaction_status } = req.body;

    const transaction = await Transaction.findOne({
        where: {
            id: order_id,
        },
    });

    if (!transaction) {
        throw new NotFoundError('Transaction not found');
    }

    if (transaction.status !== 'pending') {
        throw new BadRequestError('Transaction already paid or expired');
    }

    if (transaction_status === 'settlement') {
        transaction.status = 'settlement';
    } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
        transaction.status = 'expire';
    } else if (transaction_status === 'deny') {
        // Ignore deny status
    } else if (transaction_status === 'pending') {
        transaction.status = 'pending';
    }

    await transaction.save();

    // Enroll student to product
    if (transaction.status === 'settlement') {
        const enrollment = await Enrollment.create({
            studentId: transaction.studentId,
            productId: transaction.productId,
        });

        if (!enrollment) {
            throw new BadRequestError('Failed to enroll student to product');
        }
    }

    return transaction;
}

module.exports = {
    checkout,
    paymentHandler,
};