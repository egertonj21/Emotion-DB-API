const sqlQueries = {
    getUserHashedPassword : 'SELECT hashed_password FROM users WHERE username = ?',
    getEmotionFromUserID : 'SELECT * FROM emotion WHERE user_id = ?',
    getUserIDFromUsername : 'SELECT user_id from users WHERE username = ?',
    getEmotionFromEmotionID : 'SELECT * FROM emotion WHERE emotion_id = ?',
    addUser : 'INSERT INTO users (username, hashed_password) VALUES (?, ?)',
    addEmotionLog: 'INSERT INTO emotion (user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, timestamp, triggers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
    updateTriggers: "UPDATE emotion SET triggers = ? WHERE emotion_id = ?",
    deleteEmotionLog: "DELETE FROM emotion WHERE emotion_id = ?",
    deleteAllEmotionLogs: "DELETE FROM emotion WHERE user_id = ?",
    deleteUser: "DELETE FROM users WHERE user_id = ?"
};

module.exports = sqlQueries;