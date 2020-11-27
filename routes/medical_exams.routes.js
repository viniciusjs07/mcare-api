const express = require('express');
const router  = express.Router();
const exams_controller = require('../controllers/medical_exams.controller');
const login_controller = require('../controllers/login.controller');

//Endpoints
router.get('/:type', login_controller.verifyAuth, exams_controller.exams_get_all);
router.post('/create', login_controller.verifyAuth, exams_controller.exams_create);
router.put('/:name', login_controller.verifyAuth,exams_controller.exams_update);
router.delete('/:name', login_controller.verifyAuth, exams_controller.exams_delete);

module.exports = router;