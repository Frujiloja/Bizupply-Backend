const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "provider",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      reviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plan: {
        type: DataTypes.ENUM("free", "plus", "pro", "max"),
        defaultValue: "free",
        allowNull: false,
      },
      categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      isWide: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM("active", "pending", "inactive"),
        defaultValue: "pending",
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING,
      },
      website: {
        type: DataTypes.STRING,
      },
      joinDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );
};