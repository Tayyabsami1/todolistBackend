const express = require("express");
const todolistController = require('../controllers/todolistController')
const router = express.Router();

router.post('/create-to-do-list', todolistController.createToDoList)
router.post('/todolist_get',todolistController.getToDoLists)
router.get('/bydate_get',todolistController.getToDoListsByDate)
router.get('/pinned_get',todolistController.getPinnedToDoLists)
router.get('/archived_get',todolistController.getArchivedToDoLists)
router.post('/count_lists',todolistController.getTotalLists)
router.get('/searchToDoListsByTitle',todolistController.searchToDoListsByTitle)
router.get('/getToDoListsByCategory',todolistController.getToDoListsByCategory)
router.delete('/deleteToDoList',todolistController.deleteToDoList)

module.exports = router;