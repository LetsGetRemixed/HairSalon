const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');


router.get('/getItem/:id', inventoryController.getOneItem);
router.get('/getByCategory/:category', inventoryController.getInventoryByCategory);
router.get('/get-all-inventory', inventoryController.getAllInventory);
router.post('/update-inventory/:inventoryId', inventoryController.updateInventory);



module.exports = router;