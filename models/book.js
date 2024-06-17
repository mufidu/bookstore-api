'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.belongsToMany(models.Cart, { through: models.CartBook });
      Book.belongsToMany(models.Customer, { through: models.CustomerBook });
    }
  }
  Book.init({
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    genre: DataTypes.STRING,
    cover: DataTypes.STRING,
    author: DataTypes.STRING,
    year: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};