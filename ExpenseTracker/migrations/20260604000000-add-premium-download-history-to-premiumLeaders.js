'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('premiumleaders', 'lastExpenseDownloadAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('premiumleaders', 'expenseDownloadCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Stores a JSON-stringified array of ISO timestamps: ["2026-06-04T...Z", ...]
    await queryInterface.addColumn('premiumleaders', 'expenseDownloadHistory', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('premiumleaders', 'expenseDownloadHistory');
    await queryInterface.removeColumn('premiumleaders', 'expenseDownloadCount');
    await queryInterface.removeColumn('premiumleaders', 'lastExpenseDownloadAt');
  },
};

