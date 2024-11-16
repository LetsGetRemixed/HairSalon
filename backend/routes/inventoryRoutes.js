const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/addItem', inventoryController.addItem);
router.get('/getItem/:id', inventoryController.getOneItem);
router.get('/getByCategory/:category', inventoryController.getInventoryByCategoey);



module.exports = router;