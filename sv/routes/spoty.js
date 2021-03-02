var express = require('express');
var router = express.Router();

const { auth, getTokens, getProfile } = require('../controllers/auth.controller');

router.post('/getProfile', getProfile)
router.post('/getTokens', getTokens)
// router.get('/getCurrentPlayback', getCurrentPlayback)
router.use('/auth',auth);

module.exports = router;
