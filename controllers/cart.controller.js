const { Cart, Book } = require("../models");
const { v4: uuidv4 } = require("uuid"); 

exports.addToCart = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    console.log(`addtocart:${req.body}`)

    // Check if the book is already in the user's cart
    let cartItem = await Cart.findOne({
      where: { user_id, book_id },
    });

    if (cartItem) {
      // If the book exists, increase the quantity
      cartItem.quantity += 1;
      await cartItem.save();
      return res.status(200).json({ message: "Cart updated successfully", cartItem });
    } else {
      // If the book is not in the cart, add a new entry
      cartItem = await Cart.create({
        cart_id: uuidv4(),
        user_id,
        book_id,
        quantity: 1, // Set initial quantity to 1
      });
      return res.status(201).json({ message: "Book added to cart", cartItem });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findAll({ where: { userId: req.user.id }, include: Book });
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.removeFromCart = async (req, res) => {
//   try {
//     await Cart.destroy({ where: { id: req.params.id, userId: req.user.id } });
//     res.json({ message: "Item removed" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.removeFromCart = async (req, res) => {
  try {
    await Cart.destroy({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
