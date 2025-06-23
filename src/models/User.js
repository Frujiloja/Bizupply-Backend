const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      auth0_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false, // ✅ Requerido si viene de Auth0
      },
      role: {
        type: DataTypes.ENUM("admin", "provider", "client"),
        defaultValue: "client",
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      profile_image: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      company_name: {
        type: DataTypes.STRING,
      },
      provider_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'providers',
          key: 'id'
        }
      }
    },
    {
      timestamps: true,
    }
  );
};
