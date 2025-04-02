const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticateUser } = require("../middlewares/auth.middleware"); 

router.post("/add", authenticateUser, cartController.addToCart);
router.get("/", authenticateUser, cartController.getCart);
router.delete("/:id", authenticateUser, cartController.removeFromCart);

module.exports = router;
