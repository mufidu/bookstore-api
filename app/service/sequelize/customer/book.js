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

module.exports = {
    getAllBooks,
    getBookById,
};