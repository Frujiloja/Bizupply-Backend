require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const { Orderdetail, Product, User } = require("../db");
const { Op } = require("sequelize");

//----OBTENER TODAS LAS ORDENES -----
const getOrderdetail = async () => {
  return await Orderdetail.findAll({
    include: [{ model: Product }, { model: User }],
  });
};

//-----OBTENER ORDEN POR ID------
const getOrderById = async (id) => {
  const orderIdData = await Orderdetail.findByPk(id);
  return orderIdData;
};

//----OBTENER LAS ORDENES SEGUN SU STATUS-----
const getOrderByStatus = async (status) => {
  return await Orderdetail.findAll({
    where: {
      order_status: status,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN PRODUCTO Y USUARIO-----
const getOrderByProductAndUser = async (idProduct, idUser) => {
  return await Orderdetail.findAll({
    where: {
      productId: idProduct,
      userId: idUser,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN PRODUCTO Y FECHA-----
const getOrderByProductAndDate = async (idProduct, date) => {
  return await Orderdetail.findAll({
    where: {
      productId: idProduct,
      order_date: date,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN PRODUCTO Y STATUS-----
const getOrderByProductAndStatus = async (idProduct, status) => {
  return await Orderdetail.findAll({
    where: {
      productId: idProduct,
      order_status: status,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN PRODUCTO Y PRECIO-----
const getOrderByProductAndPrice = async (idProduct, price) => {
  return await Orderdetail.findAll({
    where: {
      productId: idProduct,
      price: price,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN PRODUCTO Y CANTIDAD-----
const getOrderByProductAndQuantity = async (idProduct, quantity) => {
  return await Orderdetail.findAll({
    where: {
      productId: idProduct,
      quantity: quantity,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN USUARIO Y FECHA-----
const getOrderByUserAndDate = async (idUser, date) => {
  return await Orderdetail.findAll({
    where: {
      userId: idUser,
      order_date: date,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN USUARIO Y STATUS-----
const getOrderByUserAndStatus = async (idUser, status) => {
  return await Orderdetail.findAll({
    where: {
      userId: idUser,
      order_status: status,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN FECHA Y STATUS-----
const getOrderByDateAndStatus = async (date, status) => {
  return await Orderdetail.findAll({
    where: {
      order_date: date,
      order_status: status,
    },
  });
};

//----OBTENER LAS ORDENES SEGUN COMPRA FINAL-----
const getOrderByPurchase = async (idPurchase) => {
  return await Orderdetail.findAll({
    where: {
      purchaseId: idPurchase,
    },
  });
};

//------CREACION DE UNA ORDEN -------
const createOrder = async (req, res, next) => {
  const Orders = req.body;

  try {
    const createdOrders = [];

    for (const detail of Orders) {
      const { quantity, productId, userId } = detail;

      const user = await User.findByPk(userId);
      const product = await Product.findByPk(productId);

      if (!user || !product) {
        return res
          .status(404)
          .json({ message: "User or Product was not found" });
      }

      if (product.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      const createdOrder = await Orderdetail.create({
        price: product.price,
        quantity,
        order_date: new Date(),
        order_status: "active",
        userId,
        productId,
      });

      createdOrders.push(createdOrder.id);
    }

    console.log("Orders created:", createdOrders);
    res.status(200).json({
      message: " Orders created",
      Orders: createdOrders,
    });
  } catch (error) {
    console.log("Error al crear las Orders:", error);
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderdetail,
  getOrderByStatus,
  getOrderByProductAndUser,
  getOrderByProductAndDate,
  getOrderByProductAndStatus,
  getOrderByProductAndPrice,
  getOrderByProductAndQuantity,
  getOrderByUserAndDate,
  getOrderByUserAndStatus,
  getOrderByDateAndStatus,
  getOrderByPurchase,
  getOrderById,
};
