const conn = require('./../utils/dbconn');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
dayjs().format('LLL');


exports.getUserHashedPassword = (req, res) => {
    const { email, password } = req.body;
    const selectSQL = 'SELECT hashed_password FROM users WHERE email =?';

    conn.query(selectSQL, [email], (error, rows) =>{
        if(error) {
            res.status(500);
            return res.json({
                status: 'failure',
                message: 'Database error'
            });
        }
        if (rows.length ===0){
            res.status(404);
            return res.json({
                status:'failure',
                message: 'User not found'
            });
        }
    const hashedPassword = rows[0].hashed_password
    bcrypt.compare(password, hashedPassword, function(error, result){
        if (error) {
            res.status(500);
            return res.json({
                status: 'failure',
                message: 'password comparison error'
            });
        }
        if(result){
            res.status(200);
            return res.json({
                status: 'success',
                message: 'Password matches'
            });
        }else{
            res.status(401);
            return res.json({
                status: 'failure',
                message: 'Incorrect password'
            });
        }
    
    
    });
});
};

exports.getEmotionsForUserID = (req, res) => {
    const { user_id } = req.params; 
    const selectSQL = 'SELECT * FROM emotion WHERE user_id =?';
    console.log("SQL Query:", selectSQL, [user_id]);
    conn.query(selectSQL, [user_id], (error, rows) => { 
        console.log(user_id);
        if (error) {
            res.status(500);
            res.json({
                status: 'failure',
                message: error
            });
        } else {
            if(rows.length >0){
                res.status(200);
                res.json({
                    status: 'success',
                    message: `${rows.length} records retrieved`,
                    result: rows
                });
            }else{
                res.status(404);
                res.json({
                    status:'failure',
                    message:'Invalid ID'
                });
            }
        }
    });
};

exports.getUserIDFromEmail = (req, res) => {
    const { email } = req.params;
    const selectSQL = 'SELECT user_id from users WHERE email = ?';
    console.log("SQL Query:", selectSQL, [email]);
    conn.query(selectSQL, [email], (error, rows) => {
        if (error) {
            console.error("Error executing SQL query:", error);
            res.status(500).json({
                status: 'failure',
                message: 'An error occurred while fetching user ID'
            });
        } else {
            if (rows.length > 0) {
                res.status(200).json({
                    status: 'success',
                    message: `User ID for user ${email} retrieved`,
                    result: rows
                });
            } else {
                res.status(404).json({
                    status: 'failure',
                    message: 'User not found'
                });
            }
        }
    });
};


exports.getEmotionfromEmotionID = (req, res) => {
    const { emotion_id } = req.params;
    const selectSQL = 'SELECT * from emotion WHERE emotion_id =?';
    console.log("SQL Query:", selectSQL, [emotion_id]);
    conn.query(selectSQL, [emotion_id], (error, rows) => {
        if (error) {
            res.status(500);
            res.json({
                status: 'failure',
                message: error
            });
        } else {
            if(rows.length >0){
                res.status(200);
                res.json({
                    status: 'success',
                    message: `emotion_id${emotion_id} retrieved`,
                    result: rows
                });
            }else{
                res.status(404);
                res.json({
                    status:'failure',
                    message:'Invalid ID'
                });
            }
        }
    });
};


exports.postInsertUser = (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    // Generate a salt and hash the password
    bcrypt.genSalt(saltRounds, function(error, salt) {
        bcrypt.hash(password, salt, function(err, hashedPassword) {
            // Handle any errors during hashing
            if (err) {
                res.status(500);
                return res.json({
                    status: 'failure',
                    message: 'Error hashing password'
                });
            }

            // Construct the SQL query to insert user data into the database
            const insertSQL = 'INSERT INTO users (email, hashed_password) VALUES (?, ?)';
            console.log("SQL Query:", insertSQL, [email, hashedPassword]);

            // Execute the SQL query
            conn.query(insertSQL, [email, hashedPassword], (error, rows) => {
                if (error) {
                    res.status(500);
                    return res.json({
                        status: 'failure',
                        message: error
                    });
                } else {
                    res.status(200);
                    return res.json({
                        status: 'success',
                        message: `User ${email} added to database`,
                        result: rows
                    });
                }
            });
        });
    });
};

exports.postInsertEmotionLog = (req, res) => {
    const { user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, triggers } = req.body;
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    // Construct the SQL query to insert emotion data into the database
    const insertSQL = 'INSERT INTO emotion (user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, timestamp, triggers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    console.log("SQL Query:", insertSQL, [user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, timestamp, triggers]);

    // Execute the SQL query
    conn.query(insertSQL, [user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, timestamp, triggers], (error, rows) => {
        if (error) {
            res.status(500);
            return res.json({
                status: 'failure',
                message: error
            });
        } else {
            res.status(200);
            return res.json({
                status: 'success',
                message: `emotion added to database for user ${user_id}`,
                result: rows
            });
        }
    });
};

exports.putChangeTrigger = (req, res) => {
    const { emotion_id, triggers } = req.body;
    
    const insertSQL = "UPDATE emotion SET triggers = ? WHERE emotion_id = ?";

    conn.query(insertSQL, [triggers, emotion_id], (error, rows) => {
        if(error){
            res.status(500);
            return res.json({
                status: 'failure',
                message: error
            });
        }else {
            res.status(200);
            return res.json({
                status: 'success',
                message: `triggers for emotion_id ${emotion_id} successfully updated`,
                result: rows
            });
        }
    });
};

exports.deleteEmotion = (req, res) => {
    const { emotion_id} = req.params;

    const deleteSQL = "DELETE FROM emotion WHERE emotion_id = ?";
    conn.query(deleteSQL, [emotion_id], (error, rows) =>{
        if(error){
            res.status(500);
            return res.json({
                status: 'failure',
                message: error
            });
        }else {
            res.status(200);
            return res.json({
                status: 'success',
                message: `emotion_id ${emotion_id}, successfully deleted`,
                result: rows
            });
        }
    });
};

exports.deleteAll = (req, res) => {
    const { user_id } = req.body;

    const deleteSQL = "DELETE FROM emotion WHERE user_id = ?";
    const deleteUserSQL = "DELETE FROM users WHERE user_id = ?";
    console.log(user_id);
    conn.query(deleteSQL, [user_id], (error, emotionRows) => {
        if (error) {
            res.status(500);
            return res.json({
                status: 'failure',
                message: error
            });
        } else {
            // If the emotion deletion was successful, proceed to delete the user
            conn.query(deleteUserSQL, [user_id], (error, userRows) => {
                if (error) {
                    res.status(500);
                    return res.json({
                        status: 'failure',
                        message: error
                    });
                } else {
                    res.status(200);
                    return res.json({
                        status: 'success',
                        message: `Logs and user deleted for user ${user_id}`,
                        emotionResult: emotionRows,
                        userResult: userRows
                    });
                }
            });
        }
    });
};

exports.getEmotionsforUserIDbyDate = (req, res) => {
    const { user_id } = req.params; 
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const selectSQL = "SELECT * FROM emotion WHERE user_id = ? AND timestamp BETWEEN ? and ?";
    console.log("SQL Query:", selectSQL, [user_id]);
    conn.query(selectSQL, [user_id, startDate, endDate], (error, rows) => { 
        console.log(user_id);
        if (error) {
            res.status(500);
            res.json({
                status: 'failure',
                message: error
            });
        } else {
            if(rows.length >0){
                res.status(200);
                res.json({
                    status: 'success',
                    message: `${rows.length} records retrieved`,
                    result: rows
                });
            }else{
                res.status(404);
                res.json({
                    status:'failure',
                    message:'Invalid ID'
                });
            }
        }
    });
};
