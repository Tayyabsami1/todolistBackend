const express = require("express");
const todoitemController = require('../controllers/todoitemController')
const router = express.Router();


router.post('/todoitem/create',todoitemController.createToDoItem)
router.delete('/todos/:listTitle/:itemId', todoitemController.deleteToDoItem);
router.get('/todoitem/total_items',todoitemController.getTotalItems)
router.get('/todoitem/pending_items',todoitemController.getPendingItems)
router.get('/todo/completed_items',todoitemController.getCompletedItems)
router.get('/todoitem/completion_status',todoitemController.getCompletionStatus)

module.exports = router