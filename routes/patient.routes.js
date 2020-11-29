const express = require('express');
const router  = express.Router();
const patient_controller = require('../controllers/patient.controller');
const login_controller = require('../controllers/login.controller');

//Endpoints
router.get('/', login_controller.verifyAuth, patient_controller.patient_get_all);
router.get('/get_by_company', login_controller.verifyAuth, patient_controller.patient_get_by_company);
router.post('/create', login_controller.verifyAuth, patient_controller.patient_create);
router.get('/:patient_name', login_controller.verifyAuth, patient_controller.patient_detail);
router.put('/:id', login_controller.verifyAuth, patient_controller.patient_update);
router.delete('/:patient_name', login_controller.verifyEmployee, patient_controller.patient_delete);
router.get('/history/:patient_name', login_controller.verifyAuth, patient_controller.patient_get_history);
module.exports = router;
