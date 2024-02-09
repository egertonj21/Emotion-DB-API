const conn = require('./../utils/dbconn');

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
    const selectSQL = 'SELECT user_id from users WHERE username =?';
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
