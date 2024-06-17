'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CustomerBook.belongsTo(models.Customer);
      CustomerBook.belongsTo(models.Book);
    }
  }
  CustomerBook.init({
    quantity: DataTypes.INTEGER,
    CustomerId: DataTypes.INTEGER,
    BookId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CustomerBook',
  });
  return CustomerBook;
};