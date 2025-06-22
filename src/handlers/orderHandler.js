require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const { NUMBER } = require("sequelize");

const {
  onlyNumbersCheck,
  onlyLettersCheck,
  onlyLettersOrNumbersCheck,
} = require("../helpers/validation.js");
//llegue hasta aca, hay que ver el handler de lo que no esta amarillo y luego rutas y luego probarlo
const {
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
} = require("../controllers/orderControllers");

// -----------xxxx-------------------------
// Traigo orden x id de mi base de datos

const getById = async (req, res, next) => {
  const { id } = req.params;
  let check = onlyNumbersCheck(id);
  if (check !== true) return res.status(412).json({ message: "Invalid Input" });
  try {
    const orderDetail = await getOrderById(id);
    orderDetail
      ? res.status(200).json(orderDetail)
      : res.status(404).json({ message: "The searched order is not found" });
  } catch (error) {
    res.status(404).json(error.message);
  }
};

// -----------xxxx-------------------------
// Traigo todos las orders o las traigo filtradas por sus propiedades

const getOrderByProperties = async (req, res, next) => {
  const { id, price, quantity, date, status, idProduct, idPurchase, idUser } =
    req.query;
  console.log("este es el query :", req.query);

  try {
    if (idProduct & idUser) {
      let check = onlyNumbersCheck(idProduct, idUser);
      if (check !== true) {
        console.log("este productId o userId: ", check);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByProductAndUser(idProduct, idUser);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message: "there is no order with the product and user required",
          });
    }
    if (idProduct & status) {
      if (status !== "active" || status !== "inactive") {
        console.log("este es status: ", status);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByProductAndStatus(idProduct, status);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message: "there is no order with the product and status required",
          });
    }
    if (idProduct & date) {
      if (!(date instanceof Date)) {
        console.log("este es date: ", date);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByProductAndDate(idProduct, date);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message: "there is no order with the product and date required",
          });
    }
    if (idProduct & price) {
      let check = onlyNumbersCheck(idProduct, price);
      if (check !== true) {
        console.log("este productId o userId: ", check);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByProductAndPrice(idProduct, price);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message:
              "there is no order with the product and the price required",
          });
    }
    if (idProduct & quantity) {
      let check = onlyNumbersCheck(idProduct, quantity);
      if (check !== true) {
        console.log("este productId o userId: ", check);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByProductAndQuantity(idProduct, quantity);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message:
              "there is no order with the product and the quantity required",
          });
    }
    if (idUser & date) {
      if (!(date instanceof Date)) {
        console.log("este es date: ", date);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByUserAndDate(idUser, date);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message: "there is no order with the user & date required",
          });
    }
    if (idUser & status) {
      if (status !== "active" || status !== "inactive") {
        console.log("este es status: ", status);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByUserAndStatus(idUser, status);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message: "there is no order with the user and status required",
          });
    }
    if (date & status) {
      if (
        !(date instanceof Date) ||
        status !== "active" ||
        status !== "inactive"
      ) {
        console.log("este es date: ", date);
        console.log("este es status: ", status);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByDateAndStatus(idUser, status);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message: "there is no order with the date & status required",
          });
    }
    if (status) {
      if (status !== "active" || status !== "inactive") {
        console.log("este es  status: ", status);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let orders = await getOrderByStatus(status);
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({
            message: "there is no detail order with the status required",
          });
    }
    if (idPurchase) {
      let check = onlyNumbersCheck(id);
      if (check !== true) {
        console.log("este idOrder: ", check);
        return res.status(500).json({ message: "Invalid Input" });
      }
      let order = await getOrderByPurchase(idPurchase);
      return order.length > 0
        ? res.status(200).json(order)
        : res.status(404).json({
            message: "there is no order with order id required",
          });
    }
    if (
      !id &&
      !price &&
      !quantity &&
      !date &&
      !status &&
      !idProduct &&
      !idPurchase &&
      !idUser
    ) {
      let orders = await getOrderdetail();
      return orders.length > 0
        ? res.status(200).json(orders)
        : res.status(404).json({ message: "Orders not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getById,
  getOrderByProperties,
};
