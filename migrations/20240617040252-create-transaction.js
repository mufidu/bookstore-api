'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoiceNumber: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
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
        amount: Sequelize.INTEGER,
        qrisString: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        expiryTime: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        invoiceDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        CustomerId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Customers',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};