const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        // Extract token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token is missing" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.userId) {
            req.payload = decoded.userId;
        } else if (decoded.chefId) {
            req.payload = decoded.chefId;
        } else {
            return res.status(401).json({ error: "Invalid token payload" });
        }

        next(); // Proceed to the next middleware
    } catch (err) {
        // Handle JWT verification errors
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token has expired" });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

module.exports = jwtMiddleware;
