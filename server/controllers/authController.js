const { getParkInfo } = require('../models/database');
const bcrypt = require('bcrypt');
const users = require('../models/users');  // Import the users model
const { createTokens, validateToken } = require('../middlewares/JWT')

module.exports = {
    Register: async (req, res) => {
        try {
            const { username, password, usertype } = req.body;
            bcrypt.hash(password, 10).then((hash) => {
                users.createUser({
                    username: username,
                    password: hash,
                    usertype: usertype
                }).then(() => {
                    res.json("USER REGISTERED");
                }).catch((err) => {
                    if (err) {
                        res.status(400).json({ error: err.message });
                    }
                });
            });
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    createGymAdmin: async (req, res) => {
        try {
            const { firstname, lastname, email } = req.body;
            users.createGymAdmin({
                firstname: firstname,
                lastname: lastname,
                email: email
            }).then(() => {
                res.json("Admin successfully created!");
            }).catch((err) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                }
            });

        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    createMembers: async (req, res) => {
        try {
            const { firstname, lastname, weight, bodytype } = req.body;
            users.createMember({
                firstname: firstname,
                lastname: lastname,
                weight: weight,
                bodytype: bodytype

            }).then(() => {
                res.json("Gym member successfully created!");
            }).catch((err) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                }
            });

        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    Login: async (req, res) => {
        try {
            const { username, password } = req.body;
    
            // Find the user in the database
            const user = await users.findOne({ username });
            if (!user) {
                return res.status(400).json({ error: "User doesn't exist" });
            }
    
            // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                req.session.authorized = false;
                return res.status(400).json({ error: "Wrong username and password combination" });
            }
    
            // Set session data if login is successful
            req.session.authorized = true;
            req.session.userType = user.user_type;
    
            // Create the access token
            const accessToken = createTokens(user);
            req.session.accessToken = accessToken;
    
            // Save the session and send the response after the session is saved
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({ error: "Failed to save session" });
                }
    
                // Log the session data to verify
                console.log('Session data after login:', req.session);
                console.log("Authorization status: ", req.session.authorized);
    
                // Send a success response with token and user type
                res.json({
                    message: `Logged in! User ID: ${user.account_id}, Username: ${user.username}, User type: ${user.user_type}`,
                    accessToken: accessToken,
                    userType: user.user_type
                });
            });
        } catch (error) {
            console.error("Error during login:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },




}