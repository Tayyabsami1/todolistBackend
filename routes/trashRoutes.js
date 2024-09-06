const TrashListController = require('../controllers/trashlistController')
const express = require('express')
const router = express.Router();


router.get('/trashlist/gettrash_lists',TrashListController.getTrashLists)
router.get('/trashlist/restore_list',TrashListController.restoreTrashList)

module.exports = router;