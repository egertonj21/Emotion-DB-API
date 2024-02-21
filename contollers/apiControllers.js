const conn = require('./../utils/dbconn');
const { query } = require('./../utils/dbconn');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './config.env' });
const saltRounds = Number(process.env.SALT_ROUNDS);
const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const userService = require('../services/userService');
dayjs().format('LLL');
const sendResponse = (res, status, message, data = null) => {
    const response = {
    status: status < 400 ? 'success' : 'failure',
    message: message,
    };
    if (data) {
    response.data = data;
    }
    res.status(status).json(response);
};

exports.getUserHashedPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendResponse(res, 400, 'Email and password are required');
    }
    try {
        const hashedPassword = await userService.getHashedPassword(email);
        await userService.comparePasswords(password, hashedPassword);
        return sendResponse(res, 200, 'Password matches');
    } catch (error) {
        let statusCode = 500;
        if (error.message === 'User not found') {
            statusCode = 404;
        } else if (error.message === 'Incorrect password') {
            statusCode = 401;
        }
        return sendResponse(res, statusCode, error.message);
    }
};


exports.getEmotionsForUserID = async (req, res) => {
    const { user_id } = req.params;
    const selectSQL = 'SELECT * FROM emotion WHERE user_id = ?';
    console.log("SQL Query:", selectSQL, [user_id]);
    try {
        const rows = await query(selectSQL, [user_id]);
        if (rows.length > 0) {
            sendResponse(res, 200, `${rows.length} record(s) retrieved`, rows);
        } else {
            sendResponse(res, 404, 'No records found for the specified user ID');
        }
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Server error. Please try again later.');
    }
};

exports.getUserIDFromEmail = async (req, res) => {
    const { email } = req.params;
    const selectSQL = 'SELECT user_id from users WHERE email = ?';

    try {
        const rows = await query(selectSQL, [email]);
        console.log("SQL Query:", selectSQL, [email]);

        if (rows.length > 0) {
            sendResponse(res, 200, `User ID for user ${email} retrieved`, rows[0].user_id);
        } else {
            sendResponse(res, 404, `User with email ${email} not found`);
        }
    } catch (error) {
        console.error("Error executing SQL query:", error);
        sendResponse(res, 500, `An error occurred while fetching user ID for email ${email}`);
    }
};


exports.getEmotionfromEmotionID = async (req, res) => {
    const { emotion_id } = req.params;
    const selectSQL = 'SELECT * from emotion WHERE emotion_id =?';
    console.log("SQL Query:", selectSQL, [emotion_id]);

    try {
        const rows = await query(selectSQL, [emotion_id]);
        if (rows.length > 0) {
            sendResponse(res, 200, `emotion_id ${emotion_id} retrieved`, rows);
        } else {
            sendResponse(res, 404, 'Invalid ID');
        }
    } catch (error) {
        console.error("Error executing SQL query:", error);
        sendResponse(res, 500, 'An error occurred while fetching emotion ID');
    }
};


exports.postInsertUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Construct the SQL query to insert user data into the database
        const insertSQL = 'INSERT INTO users (email, hashed_password) VALUES (?, ?)';
        console.log("SQL Query:", insertSQL, [email, hashedPassword]);

        // Execute the SQL query
        const rows = await query(insertSQL, [email, hashedPassword]);
        sendResponse(res, 200, `User ${email} added to database`, rows);
    } catch (error) {
        console.error("Error:", error);
        sendResponse(res, 500, 'An error occurred while adding user to database');
    }
};

exports.postInsertEmotionLog = async (req, res) => {
    const { user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, triggers } = req.body;
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

    // Construct the SQL query to insert emotion data into the database
    const insertSQL = 'INSERT INTO emotion (user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, timestamp, triggers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    console.log("SQL Query:", insertSQL, [user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, timestamp, triggers]);

    try {
        // Execute the SQL query
        const rows = await query(insertSQL, [user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, timestamp, triggers]);
        sendResponse(res, 200, `emotion added to database for user ${user_id}`, rows);
    } catch (error) {
        console.error("Error:", error);
        sendResponse(res, 500, 'An error occurred while adding emotion to database');
    }
};

exports.putChangeTrigger = async (req, res) => {
    const { emotion_id, triggers } = req.body;
    const insertSQL = "UPDATE emotion SET triggers = ? WHERE emotion_id = ?";

    try {
        const rows = await query(insertSQL, [triggers, emotion_id]);
        sendResponse(res, 200, `triggers for emotion_id ${emotion_id} successfully updated`, rows);
    } catch (error) {
        console.error("Error:", error);
        sendResponse(res, 500, 'An error occurred while updating triggers');
    }
};

exports.deleteEmotion = async (req, res) => {
    const { emotion_id } = req.params;
    const deleteSQL = "DELETE FROM emotion WHERE emotion_id = ?";

    try {
        const rows = await query(deleteSQL, [emotion_id]);
        sendResponse(res, 200, `emotion_id ${emotion_id}, successfully deleted`, rows);
    } catch (error) {
        console.error("Error:", error);
        sendResponse(res, 500, 'An error occurred while deleting emotion');
    }
};


exports.deleteAll = async (req, res) => {
    const { user_id } = req.params;
    const deleteSQL = "DELETE FROM emotion WHERE user_id = ?";
    const deleteUserSQL = "DELETE FROM users WHERE user_id = ?";
    console.log(user_id);

    try {
        const emotionRows = await query(deleteSQL, [user_id]);
        // If the emotion deletion was successful, proceed to delete the user
        const userRows = await query(deleteUserSQL, [user_id]);
        sendResponse(res, 200, `Logs and user deleted for user ${user_id}`, {emotionResult: emotionRows, userResult: userRows});
    } catch (error) {
        console.error("Error:", error);
        sendResponse(res, 500, 'An error occurred while deleting logs and user');
    }
};



exports.getEmotionsforUserIDbyDate = async (req, res) => {
    const { user_id } = req.params;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const selectSQL = "SELECT * FROM emotion WHERE user_id = ? AND timestamp BETWEEN ? and ?";
    console.log("SQL Query:", selectSQL, [user_id]);

    try {
        const rows = await query(selectSQL, [user_id, startDate, endDate]);
        console.log(user_id);

        if (rows.length > 0) {
            sendResponse(res, 200, `${rows.length} records retrieved`, rows);
        } else {
            sendResponse(res, 404, 'Invalid ID');
        }
    } catch (error) {
        console.error("Error:", error);
        sendResponse(res, 500, 'An error occurred while retrieving records');
    }
};


exports.putPasswordChange = async (req, res) => {
    const { email, newPassword } = req.body;
    // Query to update the user's password in the database
    const updateSQL = 'UPDATE users SET hashed_password = ? WHERE email = ?';

    try {
        // Hash the new password before updating it in the database
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        // Update the user's password in the database
        await query(updateSQL, [hashedNewPassword, email]);
        sendResponse(res, 200, 'Password updated successfully');
    } catch (error) {
        console.error("Error:", error);
        sendResponse(res, 500, 'An error occurred while updating password');
    }
};

exports.deleteAllEmotion = async (req, res) => {
    const { user_id } = req.params;
    const deleteSQL = "DELETE FROM emotion WHERE user_id = ?";
    console.log(user_id);

    try {
        await query(deleteSQL, [user_id]);
        // Send a success response
        sendResponse(res, 200, 'Emotions deleted successfully');
    } catch (error) {
        console.error('Error deleting emotions:', error);
        sendResponse(res, 500, 'Could not delete emotions');
    }
};
