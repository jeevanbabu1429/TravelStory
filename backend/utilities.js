const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        return res.sendStatus(401); // Unauthorized if token is missing
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user; // Attach the decoded user to the request
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = {
    authenticateToken,
};
