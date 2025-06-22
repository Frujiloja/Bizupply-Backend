const { Router } = require("express");
const cors = require("cors");
const router = Router();

const usersRouter = require("./usersRouter.js");
const providersRouter = require("./providersRouter");
const ratingsRouter = require("./ratingsRouter");
const paymentsRouter = require("./paymentsRouter");

router.use(cors());
router.use("/users", usersRouter);
router.use("/providers", providersRouter);
router.use("/ratings", ratingsRouter);
router.use("/payments", paymentsRouter);

module.exports = router;