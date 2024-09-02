const { getParkInfo } = require('../models/database');
const bcrypt = require('bcrypt');
const users = require('../models/users');  // Import the users model

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
            const {firstname, lastname, email } = req.body;
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
    Login: async (req, res) => {
        try {
            const user = await users.findOne({ username });
            if (!user) {
                return res.status(400).json({ error: "User doesn't exist" });
            }

            const dbPassword = user.password;
            bcrypt.compare(password, dbPassword)
                .then((match) => {
                    if (!match) {
                        console.log("Passwords do not match");
                        return res.status(400).json({ error: "Wrong username and password combination" });
                    } else {
                        const accessToken = createTokens(user);

                        res.cookie("access-token", accessToken, {
                            maxAge: 60 * 60 * 24 * 30 * 1000
                        });

                        res.json(`Logged in! User ID: ${user.id} Username: ${user.username}`);
                    }
                })
                .catch(err => {
                    res.status(500).json({ error: err.message });
                });
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    ShowDetails: async (req, res) => {
        try {
            const user_id = req.id;
            const userInfo = await users.getUserinfo({ user_id });
            if (!userInfo) {
                return res.status(400).json({ error: "User doesn't exist" });
            }
            res.json({
                info_id: userInfo.info_id,
                name: userInfo.name,
                lastname: userInfo.lastname,
                course: userInfo.course
            });
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
}