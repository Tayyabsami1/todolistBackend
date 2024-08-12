const User = require("../models/UserModel");
const jwt = require('jsonwebtoken')


//Error Handling
const handleErrors = (err) => {
  const error = { username: "", email: "", password: "" };
  
  //incorrect email
  if( err.message === 'Incorrect Email' ){
    error.email = 'This Email is not registered';
  }

  //incorrect Password
  if(err.message === 'Incorrect Password'){
    error.password = 'Incorrect Password'
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

//Creating JWT
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
  return jwt.sign({id}, 'to-do list web app',{
    expiresIn:maxAge
  })
}

//Controller Functions
async function registerUser(req, res) {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie('jwt',token,{httpOnly:true, maxAge: maxAge * 1000})
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json({ errors });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.login(email,password);
    const token = createToken(user._id);
    res.cookie('jwt',token,{httpOnly:true,maxAge: maxAge * 1000});
    res.status(201).json({message:'User Login Successful'})
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

async function logoutUser(req,res){
  res.cookie('jwt','',{maxAge:1});
  res.json("Log out Success!");
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
