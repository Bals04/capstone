const { getParkInfo } = require('../models/database');
const bcrypt = require('bcrypt');
const users = require('../models/users');  // Import the users model
const { createTokens, validateToken } = require('../middlewares/JWT')

module.exports = {
    Register: async (req, res) => {
        try {
            const { username, password, usertype } = req.body;
            console.log("received data: ", req.body)
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
            const user = await users.findOne({ username });

            if (!user) {
                return res.status(400).json({ error: "User doesn't exist" });
            }

            const dbPassword = user.password;
            const match = await bcrypt.compare(password, dbPassword);

            if (!match) {
                return res.status(400).json({ error: "Wrong username and password combination" });
            }

            const accessToken = createTokens(user);

            // Send a success response
            res.json({
                message: `Logged in! User ID: ${user.account_id} Username: ${user.username} User type: ${user.user_type}`,
                accessToken: accessToken,
                userType: user.user_type
            });
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error", error.message);
        }
    },

    
    

}