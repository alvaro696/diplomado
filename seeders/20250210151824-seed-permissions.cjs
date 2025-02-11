"use strict";

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const permissionsData = [{
                name: "read_user",
                description: "Permite leer usuarios",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "create_user",
                description: "Permite crear usuarios",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "update_user",
                description: "Permite actualizar usuarios",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "delete_user",
                description: "Permite eliminar usuarios",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "manage_roles",
                description: "Permite gestionar roles",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "manage_permissions",
                description: "Permite gestionar permisos",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "view_panel",
                description: "Permite ver el panel de administración",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert("permissions", permissionsData, {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("permissions", null, {});
    },
};