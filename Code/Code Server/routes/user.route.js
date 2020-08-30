const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');

router.get('/currentUser', controller.getCurrentUser);

router.get('/vip', controller.doVIP);

router.get('/filter', controller.filter);

router.get('/:uid', controller.get);

router.get('/:uid/allInfo', controller.getUserAndPet);

router.post('/location', controller.setLocation);

router.post('/toPremium', controller.upgradeToPremium);

router.post('/feedback', controller.feedback);

router.put('/', controller.updateUser);

// router.get('/getDrawer', controller.getDrawer)

module.exports = router;