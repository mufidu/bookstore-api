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
      items: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      amount: Sequelize.INTEGER,
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      qrisString: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },
      qrisURL: {
        type: Sequelize.STRING(512),
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};
