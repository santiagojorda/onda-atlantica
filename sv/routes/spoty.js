var express = require('express');
var router = express.Router();

const { auth, getToken, getProfile } = require('../controllers/auth.controller');

router.post('/getProfile', getProfile)
router.get('/callback', getToken)
router.use('/auth',auth);

module.exports = router;
