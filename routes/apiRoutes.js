const express = require('express');
const controller = require('./../contollers/apiControllers');
const router = express.Router();

router.get('/user/:user_id', controller.getEmotionsForUserID);
router.get('/username/:username', controller.getUserIDFromUsername);
router.get('/:emotion_id', controller.getEmotionfromEmotionID);
router.post('/add/user', controller.postInsertUser);
router.post('/add/emotion', controller.postInsertEmotionLog);
router.put('/updatetrigger', controller.putChangeTrigger);
router.delete('/delete', controller.deleteEmotion);
router.delete('/deleteuser', controller.deleteAll);

module.exports = router;