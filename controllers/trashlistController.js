const { TrashList } = require("../models/toDoListModel");
const { ToDoList } = require("../models/toDoListModel");
const User = require("../models/UserModel");

async function restoreTrashList(req, res) {
  try {
    const { userId, title } = req.body;
    const trashedList = await TrashList.findOneAndDelete({ 
        user: userId,
        title: title
    });
    console.log(trashedList)
    if (!trashedList) {
      throw new Error("Trash List not found with specified Id.");
    }
    const todoList = new ToDoList({
      title: trashedList.title,
      category: trashedList.category,
      items: trashedList.items,
      dueDate: trashedList.dueDate,
      user: trashedList.user,
    });
    await todoList.save();
    await User.updateOne(
      { _id: todoList.user },
      { $push: { toDoLists: todoList._id } }
    );
    return res.json({
      message: "To Do List Restored Successfully!",
      ToDoList: todoList,
    });
  } catch (err) {
    console.log(err);
    throw new Error("An error occurred while restoring to-do list.");
  }
}

async function getTrashLists(req, res) {
  const { userId } = req.body;
  try {
    const trashedLists = await TrashList.find({ user: userId });
    if (!trashedLists) {
      return res.json({
        message: `You have currently no lists in trash!`,
      });
    }
    return res.json({
      message: `User have trash lists!`,
      trashedLists,
    });
  } catch (err) {
    conosle.log(err);
    throw new Error("An error occurred while retrieving the Trash list.");
  }
}

module.exports = {
  getTrashLists,
  restoreTrashList,
};
