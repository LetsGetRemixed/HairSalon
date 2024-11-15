const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/addItem', inventoryController.addItem);
router.get('/getItem/:id', inventoryController.getOneItem);
router.get('/getByCategory/:category', inventoryController.getInventoryByCategoey);

router.get('/categories', async (req, res) => {
    try {
        const categories = await Inventory.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).send('Error fetching categories: ' + error.message);
    }
});



module.exports = router;