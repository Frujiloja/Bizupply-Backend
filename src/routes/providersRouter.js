const { Router } = require("express");
const {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  getProvidersByPlan,
  getProvidersByCategory,
} = require("../controllers/providerControllers.js");

const router = Router();

router.get("/", getAllProviders);
router.get("/plan/:plan", getProvidersByPlan);
router.get("/category/:category", getProvidersByCategory);
router.get("/:id", getProviderById);
router.post("/", createProvider);
router.put("/:id", updateProvider);
router.delete("/:id", deleteProvider);

module.exports = router;