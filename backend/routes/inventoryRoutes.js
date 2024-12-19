const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.get('/getItem/:id', inventoryController.getOneItem);
router.get('/getByCategory/:category', inventoryController.getInventoryByCategory);
router.get('/get-all-inventory', inventoryController.getAllInventory);
router.post('/update-inventory/:inventoryId', inventoryController.updateInventory);
router.post('/add-product', upload.single('image'), inventoryController.addProduct);
router.delete('/delete-product/:id', inventoryController.deleteItem);

module.exports = router;