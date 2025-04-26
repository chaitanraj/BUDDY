const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "ronaldo123";

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            }

            req.user = {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email
            };

            next();
        });

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
            error
        });
    }
};
