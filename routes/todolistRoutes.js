const express = require("express");
const todolistController = require('../controllers/todolistController')
const router = express.Router();

router.post('/create-to-do-list', todolistController.createToDoList)
router.get('/todolist_get',todolistController.getToDoLists)
router.get('/todolist/bydate_get',todolistController.getToDoListsByDate)
router.get('/todolist/pinned_get',todolistController.getPinnedToDoLists)
router.get('/todolist/archived_get',todolistController.getArchivedToDoLists)
router.get('/todolist/count_lists',todolistController.getTotalLists)

module.exports = router;