const { User } = require('../models');

const getAllUsers = async () => {
    return await User.findAll({
        attributes: { exclude: ['password_hash'] },
    });
};

const updateUser = async (userId, updateData) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    Object.assign(user, updateData);
    await user.save();
    return user;
};

const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    await user.destroy();
    return user;
};

module.exports = { getAllUsers, updateUser, deleteUser };
