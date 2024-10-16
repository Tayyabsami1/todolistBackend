const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    jwt.verify(token, "to-do list web app", (err, decodedToken) => {
        if (err) {
            console.error("JWT verification error:", err.message);
            return res.status(401).json({ message: "Invalid token" });
        }
        req.userId = decodedToken.id; // Attach userId to the request object
        next();
    });
};

module.exports = { requireAuth };
