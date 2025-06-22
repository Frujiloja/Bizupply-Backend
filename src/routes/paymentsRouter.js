const { Router } = require("express");
const {
  createPlanPayment,
  paymentNotification,
  getAllPayments,
  getProviderPayments,
} = require("../controllers/paymentControllers.js");

const router = Router();

router.post("/create-plan", createPlanPayment);
router.get("/notification", paymentNotification);
router.get("/", getAllPayments);
router.get("/provider/:providerId", getProviderPayments);

module.exports = router;