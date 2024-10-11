const ToDo = require("../models/toDoListModel");
const User = require("../models/UserModel");
const {TrashList} = require('../models/toDoListModel')


async function getTotalLists(req, res){
  // const userId = req.cookies.jwt.userId;
  const {userId} = req.body;

  try{
    const totalLists = await ToDo.ToDoList.countDocuments({user:userId});
    return res.json({
      message: `Total number of to-do lists for user ${userId}: ${totalLists}`,
      totalLists
    })
  } catch(err){
    console.log(err);
    return res.status(500).json({
      message: 'Error occurred while fetching the total number of lists.',
      error: err.message
    })
  }
}

async function searchToDoListsByTitle(req, res) {
  const { title } = req.body;
  // const userId = req.cookies.jwt.userId;

  try {
    // Search for to-do lists with titles that contain the specified search string (case-insensitive)
    const toDoLists = await ToDo.ToDoList.find({
      user: userId,
      title: { $regex: title, $options: "i" },
    });

    if (toDoLists.length === 0) {
      return res.json({
        message: `No to-do lists found with the title: "${title}".`,
      });
    }

    return res.json(toDoLists);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({
        error: "An error occurred while searching for to-do lists by title.",
      });
  }
}

async function getToDoListsByCategory(req, res) {
  // const userId = req.cookies.jwt.userId;
  const { category } = req.body;

  try {
    // Find to-do lists by userId and category
    const toDoLists = await ToDo.ToDoList.find({
      user: userId,
      category: category,
    });

    if (toDoLists.length === 0) {
      return res.json({
        message: `No to-do lists found for the category: ${category}.`,
      });
    }

    return res.json(toDoLists);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({
        error: "An error occurred while fetching to-do lists by category.",
      });
  }
}

async function getPinnedToDoLists(req, res) {
  // const userId = req.cookies.jwt.userId;
  try {
    const pinnedToDoLists = await ToDo.ToDoList.find({
      user: userId,
      isPinned: true,
    });

    if (pinnedToDoLists.length === 0) {
      return res.json({
        message: "No pinned to-do lists found for this user.",
      });
    }

    return res.json(pinnedToDoLists);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching pinned to-do lists." });
  }
}

async function getArchivedToDoLists(req, res) {
  // const userId = req.cookies.jwt.userId;

  try {
    const archivedToDoLists = await ToDo.ToDoList.find({
      user: userId,
      isArchived: true,
    });

    if (archivedToDoLists.length === 0) {
      return res.json({
        message: "No archived to-do lists found for this user.",
      });
    }

    return res.json(archivedToDoLists);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({
        error: "An error occurred while fetching archived to-do lists.",
      });
  }
}

async function getToDoListsByDate(req, res) {
  // const userId = req.cookies.jwt.userId;

  const { date } = req.body;

  try {
    // Parse the provided date to ensure it's in the correct format
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Find to-do lists for the specified user and date
    const todoLists = await ToDo.ToDoList.find({
      user: userId,
      dueDate: {
        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(parsedDate.setHours(23, 59, 59, 999)),
      },
    });

    if (todoLists.length === 0) {
      return res.json({ message: "No to-do lists found for this date." });
    }

    return res.json(todoLists);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "An error occurred." });
  }
}

async function deleteToDoList(userId, title) {
  try {
    const deletedList = await ToDo.ToDoList.findOneAndDelete({
      user: userId,
      title: title,
    });

    if (!deletedList) {
      throw new Error("To-do list not found or could not be deleted.");
    }
    const trashList = new TrashList({
      title:deletedList.title,
      category:deletedList.category,
      items:deletedList.items,
      dueDate:deletedList.dueDate,
      user: deletedList.user
  })
    await trashList.save();
    // Optionally, you can also remove the reference from the User document
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { toDoLists: deletedList._id } }
    );
    return deletedList;
  } catch (err) {
    console.log(err);
    throw new Error("An error occurred while deleting the to-do list.");
  }
}

async function doesExist(userId, title) {
  const existingList = await ToDo.ToDoList.findOne({
    user: userId,
    title: title,
  });
  if (existingList) {
    // To-Do list already exists
    console.log("A to-do list with this title already exists for the user.");
    return true;
  } else {
    // To-Do list does not exist
    console.log("To do list does not exist");
    return false;
  }
}

async function updateList(userId, title, updates) {
  try {
    const updatedList = await ToDo.ToDoList.findOneAndUpdate(
      { user: userId, title: title },
      { $set: updates },
      { new: true, useFindAndModify: false }
    );

    if (!updatedList) {
      throw new Error("Failed to update the to-do list.");
    }

    return updatedList;
  } catch (err) {
    console.log(err);
    throw new Error("An error occurred while updating the to-do list.");
  }
}

async function createToDoList(req, res) {
  // const userId = req.cookies.jwt.userId;
  const { title, category,userId, dueDate, isPinned, isArchived, deleteList } =
    req.body;
  if (deleteList === true) {
    const deletedList = await deleteToDoList(userId, title);
    return res.json({
      message: "To-do list deleted successfully.",
      deletedList,
    });
  }

  const isCreated = await doesExist(userId, title);
  if (isCreated) {
    const updatedList = await updateList(userId, title, {
      category,
      dueDate,
      isPinned,
      isArchived,
      deleteList,
    });
    return res.json({
      message: "To-do list updated successfully.",
      updatedList,
    });
  }
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.json({ message: "Invalid User Id" });
    }
    const newToDoList = new ToDo.ToDoList({
      title,
      category,
      dueDate,
      user: userId,
      isPinned,
      isArchived,
    });
    await newToDoList.save();
    user.toDoLists.push(newToDoList);
    await user.save();
    return res.json(newToDoList);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
}

async function getToDoLists(req, res) {
  // const userId = req.cookies.jwt.userId;
  const {userId} = req.body;
  try {
    const todoLists = await ToDo.ToDoList.find({ user: userId });
    return res.json(todoLists);
  } catch (err) {
    return res.json(err);
  }
}

module.exports = {
  createToDoList,
  getToDoLists,
  getToDoListsByDate,
  getPinnedToDoLists,
  getArchivedToDoLists,
  getTotalLists,
  deleteToDoList
};

