const express = require("express");
const todoitemController = require('../controllers/todoitemController')
const router = express.Router();


router.post('/create',todoitemController.createToDoItem)
router.delete('/:listTitle/:itemId', todoitemController.deleteToDoItem);
router.get('/total_items',todoitemController.getTotalItems)
router.get('/pending_items',todoitemController.getPendingItems)
router.get('/completed_items',todoitemController.getCompletedItems)
router.get('/completion_status',todoitemController.getCompletionStatus)

module.exports = router