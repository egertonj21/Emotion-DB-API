const conn = require('./../utils/dbconn');
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.getUserHashedPassword = (req, res) => {
    const { username, password } = req.body;
    const selectSQL = 'SELECT hashed_password FROM users WHERE username =?';

    conn.query(selectSQL, [username], (error, rows) =>{
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

exports.getUserIDFromUsername = (req, res) => {
    const { username } = req.params;
    const selectSQL = 'SELECT user_id from users WHERE username = ?';
    console.log("SQL Query:", selectSQL, [username]);
    conn.query(selectSQL, [username], (error, rows) => {
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
                    message: `User_id for user ${username} retrieved`,
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
    const { username, password } = req.body;
    console.log(username);
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
            const insertSQL = 'INSERT INTO users (username, hashed_password) VALUES (?, ?)';
            console.log("SQL Query:", insertSQL, [username, hashedPassword]);

            // Execute the SQL query
            conn.query(insertSQL, [username, hashedPassword], (error, rows) => {
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
                        message: `User ${username} added to database`,
                        result: rows
                    });
                }
            });
        });
    });
};

exports.postInsertEmotionLog = (req, res) => {
    const { user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, triggers } = req.body;
    // Construct the SQL query to insert emotion data into the database
    const insertSQL = 'INSERT INTO emotion (user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, timestamp, triggers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)';
    console.log("SQL Query:", insertSQL, [user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, triggers]);

    // Execute the SQL query
    conn.query(insertSQL, [user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, triggers], (error, rows) => {
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
    const { emotion_id} = req.body;

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
