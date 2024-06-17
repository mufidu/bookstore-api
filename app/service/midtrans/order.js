const { BadRequestError, NotFoundError } = require('../../errors');
const Transaction = require('../../../models').Transaction;
const Cart = require('../../../models').Cart;

const midtransClient = require('midtrans-client');
const config = require('../../../config/environment-config');
config.loadEnvironmentVariables();

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SANDBOX_SERVER_KEY,
    clientKey: process.env.MIDTRANS_SANDBOX_CLIENT_KEY,
});

const checkout = async (req) => {
    const { id, fullName, email } = req.user.customer;

    let cart = await Cart.findOne({
        where: { CustomerId: id },
    });

    // Get all books in cart
    const books = await cart.getBooks();
    cart = cart.toJSON();
    cart.books = books;

    let grossAmount = 0;
    for (const book of books) {
        grossAmount += book.price * book.CartBook.quantity;
    }

    const serviceFee = (grossAmount * 7) / 100;

    const netAmount = grossAmount + serviceFee;

    const lastTransaction = await Transaction.findOne({
        order: [['id', 'DESC']],
    });
    let invoiceNumber = "BOOKS-ORDER-0001";
    if (lastTransaction) {
        const lastInvoiceNumber = lastTransaction.invoiceNumber;
        const lastInvoiceNumberArray = lastInvoiceNumber.split('-');
        const lastInvoiceNumberInt = parseInt(lastInvoiceNumberArray[2]);
        invoiceNumber = `BOOKS-ORDER-${('0000' + (lastInvoiceNumberInt + 1)).slice(-4)}`;
    }

    const transaction = await Transaction.create({
        CustomerId: id,
        invoiceNumber,
        amount: netAmount,
        status: 'Pending',
        items: JSON.stringify(cart.books),
    });

    if (!transaction) {
        throw new BadRequestError('Failed to create transaction in database');
    }

    const midtrans = await core.charge({
        payment_type: 'qris',
        transaction_details: {
            gross_amount: netAmount,
            order_id: transaction.invoiceNumber,
        },
        customer_details: {
            full_name: fullName,
            email: email,
        },
    });

    if (midtrans.status_code !== '201') {
        transaction.status = 'failure';
        await transaction.save();
        throw new BadRequestError('Failed to create transaction in midtrans');
    } else {
        transaction.qrisString = midtrans.qr_string
        transaction.expiryTime = midtrans.expiry_time;
        transaction.invoiceDate = midtrans.transaction_time;
        transaction.qrisURL = midtrans.actions[0].url;
        await transaction.save();
    }

    // Empty cart
    cart = await Cart.findOne({
        where: { CustomerId: id },
    });
    await cart.setBooks([]);

    return transaction;
}

const paymentHandler = async (req) => {
    const { order_id, transaction_status } = req.body;

    const transaction = await Transaction.findOne({
        where: {
            invoiceNumber: order_id,
        },
    });

    if (!transaction) {
        throw new NotFoundError('Transaction not found');
    }

    if (transaction.status !== 'Pending') {
        throw new BadRequestError('Transaction already paid or expired');
    }

    if (transaction_status === 'settlement') {
        transaction.status = 'Paid';
    } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
        transaction.status = 'Expired';
    } else if (transaction_status === 'deny') {
        // Ignore deny status
    } else if (transaction_status === 'pending') {
        transaction.status = 'Pending';
    }

    await transaction.save();

    return transaction;
}

module.exports = {
    checkout,
    paymentHandler,
};