'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartBook.belongsTo(models.Book);
      CartBook.belongsTo(models.Cart);
    }
  }
  CartBook.init({
    quantity: DataTypes.INTEGER,
    BookId: DataTypes.INTEGER,
    CartId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartBook',
  });
  return CartBook;
};