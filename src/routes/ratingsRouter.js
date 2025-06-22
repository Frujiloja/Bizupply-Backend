const { Router } = require("express");
const {
  createRating,
  getProviderRatings,
  updateRating,
  deleteRating,
} = require("../controllers/ratingControllers.js");

const router = Router();

router.post("/", createRating);
router.get("/provider/:providerId", getProviderRatings);
router.put("/:id", updateRating);
router.delete("/:id", deleteRating);

module.exports = router;