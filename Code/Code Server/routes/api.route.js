const express = require('express');

const router = express.Router();

const controller = require('../controllers/api.controller');

// router.get('/', controller.getProfile);

router.post('/react', controller.react)

router.post('/match', controller.match)

module.exports = router;