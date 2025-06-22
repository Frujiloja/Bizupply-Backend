const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo probando
  sequelize.define(
    "orderdetail",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      order_status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
