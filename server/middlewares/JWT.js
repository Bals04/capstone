const { sign, verify } = require("jsonwebtoken");
const SECRET_KEY = "jwtsecret";  // Replace with your actual secret key or use an environment variable

// Function to create JWT tokens
const createTokens = (user) => {
  const accessToken = sign(
    { 
      username: user.username, 
      id: user.id,
      user_type: user.user_type  // Attach the userType to the token payload (e.g., Member, Trainer, etc.)
    },
    SECRET_KEY,
    { expiresIn: '1h' }  // You can set an expiration time for the token
  );
  console.log('Generated Access Token:', accessToken);
  return accessToken;
};

// Middleware to validate JWT tokens
const validateToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader)
    return res.status(401).json({ error: "User not authenticated" });

  try {
    const token = authorizationHeader.split(' ')[1];  // Extract token from 'Bearer <token>'
    const validToken = verify(token, SECRET_KEY);  // Verify token with the secret key

    if (validToken) {
      req.authenticated = true;
      req.id = validToken.id;             // Attach user ID to the request object
      req.username = validToken.username; // Attach username to the request object (optional)
      req.user_type = validToken.user_type; // Attach userType (e.g., Member, Trainer) for role checks
      return next();                      // Proceed to the next middleware or route handler
    }

  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });  // 403 forbidden for invalid tokens
  }
};

// Export the createTokens and validateToken functions
module.exports = { createTokens, validateToken };
