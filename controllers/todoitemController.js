const { ToDoList, ToDoItem } = require('../models/toDoListModel'); // Assuming your models are in this file


async function getCompletedItems(req, res){
  const {userId} = req.body;
//   const userId = req.cookies.jwt.userId;

  try{
    const lists = await ToDoList.find({user:userId});
    let completedItems = 0 ;
    lists.forEach(list=>{
      list.items.forEach(item=>{
        if(item.progress === 'done'){
          completedItems++;
        }
      })
    })
    return res.json({
      message: `Total number of 'done' items for user ${userId}: ${completedItems}`,
      completedItems
    })
  }  catch (err){

  }
}

async function getPendingItems(req, res){
  const {userId} = req.body;
//   const userId = req.cookies.jwt.userId;
  try{
    const lists = await ToDoList.find({user:userId});
    let pendingItems = 0 ;
    lists.forEach(list=>{
      list.items.forEach(item=>{
        if(item.progress === 'to-do'){
          pendingItems++;
        }
      })
    })
    return res.json({
      message: `Total number of 'to-do' items for user ${userId}: ${pendingItems}`,
      pendingItems
  });
  }  catch(err){
    console.log(err);
        return res.status(500).json({
            message: 'Error occurred while fetching the count of "to-do" items.',
            error: err.message
        });
  }

}

async function getTotalItems(req, res){
  const {userId} = req.body;
//   const userId = req.cookies.jwt.userId;
  try{ 
    const lists = await ToDoList.find({user:userId})
    let totalTasks = 0 ;
    lists.forEach(list =>{
      totalTasks += list.items.length;
    })

    return res.json({
      message: `Total number of tasks for user ${userId}: ${totalTasks}`,
      totalTasks
  });
    
  } catch (err){
    console.log(err);
        return res.status(500).json({
            message: 'Error occurred while fetching the total number of tasks.',
            error: err.message
        }); 
  }
}


async function createToDoItem(req, res) {
  const { userId, listTitle, content, priority, progress } = req.body;
//   const userId = req.cookies.jwt.userId;
  try {
    // Find the to-do list by userId and listTitle
    const toDoList = await ToDoList.findOne({
      title: listTitle.trim(),
      user: userId
    });

    if (!toDoList) {
      return res.status(404).json({ message: 'To-do list not found.' });
    }

    // Create a new to-do item
    const newItem = {
      content,
      priority,
      progress
    };

    // Add the new item to the to-do list's items array
    toDoList.items.push(newItem);

    // Save the updated to-do list
    await toDoList.save();

    return res.json({ message: 'To-do item added successfully.', toDoList });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while adding the to-do item.' });
  }
}


async function deleteToDoItem(req, res) {
  const { userId } = req.body;
  const {listTitle , itemId } = req.params;

  try {
    // Find the to-do list by userId and listTitle
    const toDoList = await ToDoList.findOne({
      title: listTitle.trim(),
      user: userId
    });

    if (!toDoList) {
      return res.status(404).json({ message: 'To-do list not found.' });
    }

    // Find the index of the item to be deleted
    const itemIndex = toDoList.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'To-do item not found.' });
    }

    // Remove the item from the items array
    toDoList.items.splice(itemIndex, 1);

    // Save the updated to-do list
    await toDoList.save();

    return res.json({ message: 'To-do item deleted successfully.', toDoList });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while deleting the to-do item.' });
  }
}


async function getCompletionStatus(req, res){
  const {userId} = req.body;
//   const userId = req.cookies.jwt.userId;
  try{
    const lists = await ToDoList.find({user:userId});
    let totalItems = 0 ;
    let completedItems = 0 ;
    lists.forEach(list=>{
      list.items.forEach(item=>{
        if(item.progress === 'done'){
          completedItems++;
        }
        totalItems++;
      })
    })
    let todoItems = totalItems - completedItems;
    return res.json({
      message:`Task Done:${(completedItems/totalItems)*100} Remaining Tasks: ${(todoItems/totalItems)*100}`,
      donePercent: (completedItems/totalItems)*100,
      todoPercent: (todoItems/totalItems)*100
    })
  } catch (err){
    console.log(err);
    return res.status(500).json({
        message: 'Error occurred while fetching the Completion Status.',
        error: err.message
    }); 
  }
}

module.exports = {
    createToDoItem,
    deleteToDoItem,
    getTotalItems,
    getPendingItems,
    getCompletedItems,
    getCompletionStatus
}