const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "delivery",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      delivered_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      delivery_status: {
        type: DataTypes.ENUM("in processs", "delivered"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
