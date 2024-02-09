const express = require('express');
const controller = require('./../contollers/apiControllers');
const router = express.Router();

router.get('/user/:user_id', controller.getEmotionsForUserID);
router.get('/username/:username', controller.getUserIDFromUsername);
router.get('/:emotion_id', controller.getEmotionfromEmotionID);

module.exports = router;