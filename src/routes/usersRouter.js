const { Router } = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  createUser,
  getUserByEmail,
  getAllUsers,
  getSavedProviders,
  addSavedProvider,
  removeSavedProvider,
} = require("../controllers/userControllers.js");

const router = Router();

router.get("/", getAllUsers);
router.post("/mail", getUserByEmail);
router.post("/create", createUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", updateUserProfile);

// Guardados por usuario (basado en actualUser.id)
router.get("/:id/saved-providers", getSavedProviders);
router.post("/:id/saved-providers", addSavedProvider);
router.delete("/:id/saved-providers/:providerId", removeSavedProvider);

module.exports = router;