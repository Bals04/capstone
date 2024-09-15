const db = require('./database');
const { pool } = require('./database');

// Create a new conversation between a member and a trainer
const createConversation = async ({ member_id, trainer_id }) => {
    return db.query(
        'INSERT INTO conversation_tbl (member_id, trainer_id, last_message_at, status) VALUES (?, ?, NOW(), ?)',
        [member_id, trainer_id, 'active']
    );
};

// Check if a conversation exists between a member and a trainer
const checkConversationExists = async ( member_id, trainer_id ) => {
    console.log('Parameters received:', member_id, trainer_id); // Debug log
    const [rows] = await pool.query(
        'SELECT id FROM conversation_tbl WHERE member_id = ? AND trainer_id = ? LIMIT 1',
        [member_id, trainer_id]
    );
    return rows.length > 0 ? rows[0] : null;
};

// Insert a message into an existing conversation
const sendMessage = async ({ conversation_id, sender_id, message }) => {
    return db.query(
        'INSERT INTO messages (conversation_id, sender_id, message, sent_at) VALUES (?, ?, ?, NOW())',
        [conversation_id, sender_id, message]
    );
};

// Update the last message timestamp in the conversation table
const updateLastMessageTimestamp = async ({ conversation_id }) => {
    return db.query(
        'UPDATE conversation_tbl SET last_message_at = NOW() WHERE id = ?',
        [conversation_id]
    );
};

// Get chat history between a member and trainer
const getChatHistory = async ( member_id, trainer_id ) => {
    const [rows] = await pool.query(
        `SELECT m.message, m.sent_at, 
                CASE 
                    WHEN m.sender_id = ? THEN 'Member' 
                    ELSE 'Trainer' 
                END AS sender
         FROM messages m
         JOIN conversation_tbl c ON m.conversation_id = c.id
         WHERE c.member_id = ? AND c.trainer_id = ?
         ORDER BY m.sent_at ASC`,
        [member_id, member_id, trainer_id]
    );

    // console.log('Query result:', rows); // Debug log

    return rows;
};


module.exports = {
    createConversation,
    checkConversationExists,
    sendMessage,
    updateLastMessageTimestamp,
    getChatHistory,
};
