const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true,'Please enter a username'],
        unique: true
    },
    email: {
        type: String,
        required: [true,'Please enter an Email'],
        unique: true,
        validate:[isEmail,'Please enter a valid email!']
    },
    password: {
        type: String,
        required: [true,'Please enter a password']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    toDoLists: [{
        type: Schema.Types.ObjectId,
        ref: 'ToDoList'
    }]
});

UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

UserSchema.statics.login = async function(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw Error('Incorrect Email');
    }
    const auth = bcrypt.compare(password, user.password);
    if(!auth){
        throw Error('Incorrect Password');
    }
    return user;
}

const User = mongoose.model('User', UserSchema);
module.exports = User;
