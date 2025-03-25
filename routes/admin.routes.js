
const express = require('express');
const { authenticate, authorizeAdmin } = require("../middlewares/auth.middleware");
const userController = require('../controllers/admin.controller');
const router = express.Router();

// Get all users (Admin only)
router.get('/admin', authenticate, authorizeAdmin, userController.getUsers);
router.put('/admin/:id', authenticate, authorizeAdmin, userController.updateUser);
router.delete('/admin/:id', authenticate, authorizeAdmin, userController.deleteUser);

module.exports = router;
