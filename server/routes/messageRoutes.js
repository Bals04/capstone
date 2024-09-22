    const express = require("express");
    const router = express.Router();
    const message = require('../controllers/messageController');

    router.get("/checkConvo", message.checkConversation); 
    router.get("/messages", message.getChatHistory); 
    router.post("/send", message.sendMessage); 


    module.exports = router;

