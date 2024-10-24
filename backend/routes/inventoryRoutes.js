const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/addItem', inventoryController.addItem);
router.get('/allItems', inventoryController.getAllInventory);


module.exports = router;