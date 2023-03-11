/* eslint-disable no-undef */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rolesAndPermissions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      permissions: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    // drop RolesAndPermissions table
    await queryInterface.dropTable("rolesAndPermissions");
  },
};
