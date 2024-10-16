const userController = require('../controllers/userController')
const express = require('express')
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/current', requireAuth, userController.fetchUserData); 
router.patch('/user/update',userController.updateUserDetails);
router.patch('/user/password',userController.changePassword)


module.exports = router;