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
    },
    amount: DataTypes.INTEGER,
    items: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    qrisString: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    qrisURL: {
      type: DataTypes.STRING(512),
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