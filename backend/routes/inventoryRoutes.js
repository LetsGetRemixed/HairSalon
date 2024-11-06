const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/addItem', inventoryController.addItem);
router.get('/allItems', inventoryController.getAllInventory);
router.get('/getItem/:id', inventoryController.getOneItem);
router.patch('/updateQuantity', inventoryController.updateQuantity);


module.exports = router;