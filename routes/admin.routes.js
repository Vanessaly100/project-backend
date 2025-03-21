
const express = require('express');
const { authenticate, checkRole} = require("../middlewares/auth.middleware");
const userController = require('../controllers/admin.controller');
const router = express.Router();

// Get all users (Admin only)
router.get('/admin', authenticate, checkRole(["admin"]), userController.getUsers);
router.put('/admin/:id', authenticate, checkRole(["admin"]), userController.updateUser);
router.delete('/admin/:id', authenticate, checkRole(["admin"]), userController.deleteUser);

module.exports = router;
