const express = require("express");
const todolistController = require('../controllers/todolistController')
const router = express.Router();

router.post('/create-to-do-list', todolistController.createToDoList)
router.get('/todolist_get',todolistController.getToDoLists)
router.get('/todolistbydate_get',todolistController.getToDoListsByDate)
router.get('/todolistpinned_get',todolistController.getPinnedToDoLists)
router.get('/todolistarchived_get',todolistController.getArchivedToDoLists)

module.exports = router;