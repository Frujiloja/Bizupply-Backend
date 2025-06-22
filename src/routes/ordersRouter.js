const { Router } = require("express");
require("dotenv").config();

const { createOrder } = require("../controllers/orderControllers.js");
const {
  getById,
  getOrderByProperties,
} = require("../handlers/orderHandler.js");

const router = Router();

router.get("/", getOrderByProperties); //falta probar ruta
router.get("/:id", getById); // falta probar ruta
router.post("/create", createOrder);

module.exports = router;
