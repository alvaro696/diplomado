"use strict";

// Utilizamos require para obtener la función de encriptar.
// Asegúrate de que en ../src/common/bcrypt.js esté exportada usando module.exports.
const { encriptar } = require("../src/common/bcrypt.js");

module.exports = {
    up: async(queryInterface, Sequelize) => {
        // Buscar el rol admin para asignar su ID
        const [roles] = await queryInterface.sequelize.query(
            "SELECT id FROM roles WHERE name = 'admin';"
        );
        if (!roles || roles.length === 0) {
            throw new Error("No se encontró el rol admin");
        }
        const adminRoleId = roles[0].id;

        // Encriptar la contraseña "admin"
        const hashedPassword = await encriptar("admin");

        // Crear el usuario administrador
        const adminUser = {
            username: "admin",
            password: hashedPassword,
            status: "ACTIVE", // Asegúrate de que este valor coincide con lo esperado en tu modelo
            roleId: adminRoleId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Inserta el usuario en la tabla "users"
        await queryInterface.bulkInsert("users", [adminUser], {});
        console.log("Usuario admin creado correctamente.");
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("users", { username: "admin" }, {});
        console.log("Usuario admin eliminado.");
    },
};