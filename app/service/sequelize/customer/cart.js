const { BadRequestError, NotFoundError } = require('../../../errors');
const { sequelize } = require('../../../../models');
const Book = require('../../../../models').Book;
const Cart = require('../../../../models').Cart;
const CartBook = require('../../../../models').CartBook;
const config = require('../../../../config/environment-config');
config.loadEnvironmentVariables();

const getCart = async (req) => {
    const { id } = req.user.customer;
    let cart = await Cart.findOne({
        where: { CustomerId: id },
    });
    if (!cart) {
        cart = await Cart.create({ CustomerId: id });
    }

    // Get all books and their quantity in cart
    const books = await cart.getBooks();
    cart = cart.toJSON();
    cart.books = books;

    return cart;
}

const addBookToCart = async (req) => {
    const { id } = req.user.customer;
    const { bookId, quantity } = req.body;

    const book = await Book.findOne({ where: { id: bookId } });
    if (!book) {
        throw new NotFoundError('Book not found');
    }

    let cart = await Cart.findOne({ where: { CustomerId: id } });
    if (!cart) {
        // Create cart if not exists
        cart = await Cart.create({ CustomerId: id });
    }

    const cartBook = await CartBook.findOne({
        where: { CartId: cart.id, BookId: bookId },
    });

    if (cartBook) {
        // Update quantity if book exists in cart
        cartBook.quantity = quantity;
        await cartBook.save();
    } else {
        // Add book to cart
        await cart.addBook(book, { through: { quantity } });
    }

    // Update total price in cart
    // Loop through all books in cart and calculate total price
    let totalPrice = 0;
    const cartBooks = await cart.getBooks();
    for (const cartBook of cartBooks) {
        totalPrice += cartBook.price * cartBook.CartBook.quantity;
        console.log(cartBook.price, cartBook.CartBook.quantity);
    }
    await cart.update({ totalPrice });

    const books = await cart.getBooks();
    cart = cart.toJSON();
    cart.books = books;

    return cart;
}

const removeBookFromCart = async (req) => {
    const { id } = req.user.customer;
    const { bookId } = req.body;

    const book = await Book.findOne({ where: { id: bookId } });
    if (!book) {
        throw new NotFoundError('Book not found');
    }

    const cart = await Cart.findOne({ where: { CustomerId: id } });
    if (!cart) {
        throw new NotFoundError('Cart not found');
    }

    const cartBook = await CartBook.findOne({
        where: { CartId: cart.id, BookId: bookId },
    });
    if (!cartBook) {
        throw new NotFoundError('Book not found in cart');
    }

    await cart.removeBook(book);

    // Update total price in cart
    // Loop through all books in cart and calculate total price
    let totalPrice = 0;
    const cartBooks = await cart.getBooks();
    for (const cartBook of cartBooks) {
        totalPrice += cartBook.price * cartBook.CartBook.quantity;
    }
    await cart.update({ totalPrice });

    return cart;
}

module.exports = {
    getCart,
    addBookToCart,
    removeBookFromCart,
};
