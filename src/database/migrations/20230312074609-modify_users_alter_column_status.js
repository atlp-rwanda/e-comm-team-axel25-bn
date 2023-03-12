/* eslint-disable no-undef */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_status" ADD VALUE 'Disabled'`,
    );
  },
  async down(queryInterface) {
    return queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'Disabled' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_status')`,
    );
  },
};
