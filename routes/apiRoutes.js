const express = require('express');
const controller = require('./../contollers/apiControllers');
const router = express.Router();
const sqlQueries = require('./../queries/queries');


router.post('/login', controller.getUserHashedPassword);
router.get('/user/:user_id', controller.getEmotionsForUserID);
router.post('/email/:email', controller.getUserIDFromEmail);
router.get('/:emotion_id', controller.getEmotionfromEmotionID);
router.post('/add/user', controller.postInsertUser);
router.post('/add/emotion', controller.postInsertEmotionLog);
router.put('/updatetrigger', controller.putChangeTrigger);
router.delete('/delete/:emotion_id', controller.deleteEmotion);
router.delete('/deleteuser/:user_id', controller.deleteAll);
router.delete('/deleteEmotion/:user_id', controller.deleteAllEmotion);
router.get('/userByDate/:user_id', controller.getEmotionsforUserIDbyDate);
router.put('/updatePassword', controller.putPasswordChange);

module.exports = router;