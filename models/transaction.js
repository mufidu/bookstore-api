'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Customer);
    }
  }
  Transaction.init({
    invoiceNumber: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [
            [
              'settlement',
              'pending',
              'expire',
              'failure',
              'cancelled',
              'refunded',
              'finished',
              'cart',
              'unknown',
            ],
          ],
          msg: 'Transaction status is invalid',
        },
      },
    },
    amount: DataTypes.INTEGER,
    qrisString: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiryTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CustomerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};