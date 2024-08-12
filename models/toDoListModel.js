const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoItemSchema = new Schema({
    content: {
        type: String,
        required: [true,'Please enter content for to do item'],
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    progress: {
        type: String,
        enum: ['to-do', 'in-progress', 'done'],
        default: 'to-do'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ToDoListSchema = new Schema({
    subject: {
        type: String,
        required: [true,'Please enter subject for this to-do list.'],
        trim: true
    },
    title: {
        type: String,
        required: [true,'Please enter title for this to-do list.'],
        trim: true
    },
    items: [ToDoItemSchema],
    dueDate: {
        type: Date
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    labels: [{
        type: String,
        trim: true
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ToDoList = mongoose.model('ToDoList', ToDoListSchema);
const ToDoItem = mongoose.model('ToDoItem',ToDoItemSchema)
module.exports = {ToDoList,ToDoItem};
