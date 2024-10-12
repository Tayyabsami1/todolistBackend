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

async function logoutUser(req, res) {
  console.log("Logout function called");
  res.cookie('jwt', '', { maxAge: 1, httpOnly: true, secure: true, sameSite: 'strict' });
  res.json("Log out Success!");
}

//Check Auth Token
const checkAuth = (req, res) => {
  // Retrieve the JWT token from cookies
  const token = req.cookies.jwt;

  // If no token is present, return an unauthorized response
  if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
  }

  // Verify the token using the same secret used during token creation
  jwt.verify(token, 'to-do list web app', (err, decodedToken) => {
      if (err) {
          // If token verification fails, return an unauthorized response
          return res.status(401).json({ message: 'Invalid token' });
      }

      // If token is valid, send a success response
      res.status(200).json({ message: 'Authenticated', userId: decodedToken.id });
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth
};
