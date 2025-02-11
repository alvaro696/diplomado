"use strict";

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const rolesData = [{
                name: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert("roles", rolesData, {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("roles", null, {});
    },
};