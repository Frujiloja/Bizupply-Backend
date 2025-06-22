const { Router } = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  createUser,
} = require("../controllers/userControllers.js");

const router = Router();

router.post("/create", createUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", updateUserProfile);

module.exports = router;