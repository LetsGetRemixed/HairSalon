const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.getAllUsers);
router.post('/register', userController.createUser);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);
router.post('/:id/extend-membership', userController.createMembership);

module.exports = router;