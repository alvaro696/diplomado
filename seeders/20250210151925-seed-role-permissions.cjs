"use strict";

module.exports = {
    up: async(queryInterface, Sequelize) => {
        // Obtener todos los permisos
        const [permissions] = await queryInterface.sequelize.query(
            `SELECT id, name FROM permissions;`
        );
        // Obtener el rol "admin"
        const [roles] = await queryInterface.sequelize.query(
            `SELECT id, name FROM roles WHERE name = 'admin';`
        );

        if (roles.length === 0) {
            throw new Error("No se encontró el rol admin");
        }
        const adminRoleId = roles[0].id;

        // Asignar todos los permisos al rol admin (puedes filtrar si es necesario)
        const adminPermissions = permissions.map((perm) => ({
            roleId: adminRoleId,
            permissionId: perm.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await queryInterface.bulkInsert("RolePermissions", adminPermissions, {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("RolePermissions", null, {});
    },
};