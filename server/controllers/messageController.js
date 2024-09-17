const { createConversation, checkConversationExists, sendMessage, updateLastMessageTimestamp, getChatHistory } = require('../models/messages');

module.exports = {
    checkConversation: async (req, res) => {
        try {
            const { member_id, trainer_id } = req.query;
            const exists = await checkConversationExists(member_id, trainer_id);
            if (!exists) {
                await createConversation(member_id, trainer_id);
            }
            res.status(200).json(exists);
        } catch (error) {
            console.error("Error creating conversation:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    
    sendMessage: async (req, res) => {
        try {
            const { conversation_id, sender_id, message, img_path} = req.body;

            
            await sendMessage({ conversation_id, sender_id, message, img_path});
           // await updateLastMessageTimestamp(conversationId, timestamp);
            
            res.status(200).send("Message sent successfully");
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    
    getChatHistory: async (req, res) => {
        try {
            const { member_id, trainer_id } = req.query;
            const messages = await getChatHistory(member_id, trainer_id);
            
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching chat history:", error);
            res.status(500).send("Internal Server Error");
        }
    }
};
