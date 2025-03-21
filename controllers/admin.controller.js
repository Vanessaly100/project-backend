
const { User } = require("../models");

const userService = require('../services/admin.service');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { first_name, last_name, email, role, membership_type } = req.body;

        const updatedUser = await userService.updateUser(userId, {
            first_name, last_name, email, role, membership_type
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await userService.deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getUsers, updateUser, deleteUser };

