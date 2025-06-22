const { Router } = require("express");
require("dotenv").config();

const { createPurchase, getPurchases , dataStats } = require("../controllers/purchaseControllers");
// const {
//   getById,
//   getOrderByProperties,
// } = require("../handlers/orderHandler.js");

const router = Router();

// router.get("/", getOrderByProperties); //falta probar ruta
// router.get("/:id", getById); // falta probar ruta
router.post("/create", createPurchase);
router.get("/getAllPurchases", getPurchases);
router.get("/dataStats", dataStats);

module.exports = router;