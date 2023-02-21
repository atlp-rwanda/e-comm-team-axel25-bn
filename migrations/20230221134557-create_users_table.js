/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // create users table
    await queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        surName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
        },
        givenName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
          set(value) {
            this.setDataValue(
              'password',
              bcrypt.hashSync(value, bcrypt.genSaltSync(10))
            );
          },
        },
        role: {
          type: Sequelize.ENUM('Admin', 'Buyer', 'Seller'),
          defaultValue: 'Buyer',
        },
        status: {
          type: Sequelize.ENUM('Pending', 'Active'),
          defaultValue: 'Pending',
        },
        confirmationCode: {
          type: Sequelize.STRING,
          unique: true,
        },
        googleId: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        resetToken: {
          type: Sequelize.STRING,
          unique: true,
        },
        province: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        district: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sector: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        cell: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        street: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        timestamps: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
