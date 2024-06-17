const { BadRequestError, NotFoundError } = require('../../../errors');
const { sequelize } = require('../../../../models');
const Book = require('../../../../models').Book;
const config = require('../../../../config/environment-config');
config.loadEnvironmentVariables();

const getAllBooks = async (req) => {
    const { genre, author, year } = req.body;

    const where = {};
    if (genre) {
        where.genre = genre;
    }
    if (author) {
        where.author = author;
    }
    if (year) {
        where.year = year;
    }

    const books = await Book.findAll({ where });
    return books;
}

const getBookById = async (req) => {
    const { id } = req.params;

    const book = await Book.findByPk(id);
    if (!book) {
        throw new NotFoundError('Book not found');
    }

    return book;
}

const addNewBook = async (req) => {
    const { title, price, genre, cover, author, year, quantity } = req.body;

    if (!title || !price || !genre || !cover || !author || !year || !quantity) {
        throw new BadRequestError('All fields are required');
    }

    const result = await sequelize.transaction(async (t) => {
        const sequelizeBook = await Book.create(
            {
                title: title,
                price: price,
                genre: genre,
                cover: cover,
                author: author,
                year: year,
                quantity: quantity
            },
            {
                transaction: t,
            }
        );
        return sequelizeBook;
    });
    return result;
}

const updateBookById = async (req) => {
    const { id } = req.params;
    const { title, price, genre, cover, author, year, quantity } = req.body;

    const book = await Book.findByPk(id);
    if (!book) {
        throw new NotFoundError('Book not found');
    }

    const result = await sequelize.transaction(async (t) => {
        const updatedBook = await Book.update(
            {
                title: title,
                price: price,
                genre: genre,
                cover: cover,
                author: author,
                year: year,
                quantity: quantity
            },
            {
                where: { id },
                returning: true,
                plain: true,
                transaction: t,
            });
        return updatedBook[1].dataValues;
    });

    return result;
}

const deleteBookById = async (req) => {
    const { id } = req.params;

    const book = await Book.findByPk(id);
    if (!book) {
        throw new NotFoundError('Book not found');
    }

    await Book.destroy({ where: { id } });
    return { message: 'Book deleted successfully' };
}

module.exports = {
    getAllBooks,
    getBookById,
    addNewBook,
    updateBookById,
    deleteBookById,
};
