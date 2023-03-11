/* eslint-disable no-undef */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    //  seed an admin, seller, and buyer
    await queryInterface.bulkInsert(
      "rolesAndPermissions",
      [
        {
          id: "a6adf4ad-dac5-4ac6-9419-cd885de58eb0",
          role: "Admin",
          permissions: [
            "Set permissions",
            "Update product",
            "Add product",
            "View oders",
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("rolesAndPermissions", null, {});
  },
};
