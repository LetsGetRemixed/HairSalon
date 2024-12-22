const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', userController.createUser);
router.post('/login', userController.login);
router.post('/upload-license/:userId', upload.single('image'), userController.uploadLicense);
router.put('/update-user-info/:userId', userController.updateUser);
router.get('/all-users', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/get-user-license/:userId', userController.getLicenseSignedUrl);
router.delete('/:id', userController.deleteUser);



module.exports = router;