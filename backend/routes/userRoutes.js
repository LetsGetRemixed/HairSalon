const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.createUser);
router.get('/:id', userController.getUserById);
router.get('/users', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router;