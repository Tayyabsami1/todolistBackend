const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

// Error Handling Function
const handleErrors = (err) => {
    const error = { username: "", email: "", password: "" };

    if (err.message === "Incorrect Email") error.email = "This email is not registered";
    if (err.message === "Incorrect Password") error.password = "Incorrect password";

    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }
    return error;
};

// JWT Token Creation
const maxAge = 3 * 24 * 60 * 60; // Token expiration (3 days)
const createToken = (id) => jwt.sign({ id }, "to-do list web app", { expiresIn: maxAge });

// Register User
async function registerUser(req, res) {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use" });
        }
        const user = await User.create({ username, email, password });
        const token = createToken(user._id);

        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000, secure: true, sameSite: "strict" });
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(500).json({ errors });
    }
}

// Login User
async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000, secure: true, sameSite: "strict" });
        res.status(201).json({ message: "User login successful" });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

// Logout User
async function logoutUser(req, res) {
    res.cookie("jwt", "", { maxAge: 1, httpOnly: true, secure: true, sameSite: "strict" });
    res.status(200).json({ message: "Logout successful" });
}

// Check Authentication Status
const checkAuth = (req, res) => {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    jwt.verify(token, "to-do list web app", (err, decodedToken) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        res.status(200).json({ message: "Authenticated", userId: decodedToken.id });
    });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
};
