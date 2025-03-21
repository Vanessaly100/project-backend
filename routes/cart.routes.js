const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middleware"); 

router.post("/add", authenticate, cartController.addToCart);
router.get("/", authenticate, cartController.getCart);
router.delete("/:id", authenticate, cartController.removeFromCart);

module.exports = router;
