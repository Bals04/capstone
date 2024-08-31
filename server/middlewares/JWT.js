const {sign, verify} = require("jsonwebtoken");

const createTokens = (user) => {
    const accessToken = sign({username: user.username, id: user.id},
        "jwtsecret"
    );
    console.log(accessToken);
    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
  
    if (!accessToken)
      return res.status(400).json({ error: "User not authenticated" });
  
    try {
      const validToken = verify(accessToken, "jwtsecret");
      if (validToken) {
        req.authenticated = true;
        req.id = validToken.id;  // Attach the user ID to the request
        req.username = validToken.username;  // Attach the username to the request (optional)
        return next();
      }
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  };

module.exports = {createTokens, validateToken}