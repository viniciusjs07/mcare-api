const express             = require('express');
const router              = express.Router();
const services_controller = require('../controllers/services.controller');
const login_controller    = require('../controllers/login.controller');

router.get('/', login_controller.verifyEmployee, services_controller.service_get_all);
router.post('/register', login_controller.verifyEmployee, services_controller.service_register);
router.put('/:service_identifier', login_controller.verifyEmployee, services_controller.service_update);
router.get('/get/:service_identifier', login_controller.verifyEmployee, services_controller.service_details);
router.get('/professional/:professional_name', login_controller.verifyEmployee, services_controller.service_get_by_professional);
router.put('/scheduling/:id', login_controller.verifyAuth, services_controller.service_scheduling_update);
router.get('/scheduling/all/:professional_name', login_controller.verifyAuth, services_controller.scheduling_get_all);
router.get('/scheduling/all_count/:professional_name', login_controller.verifyAuth, services_controller.scheduling_get_all_count);
router.post('/scheduling', login_controller.verifyAuth, services_controller.service_scheduling);
router.get('/scheduling/:id', login_controller.verifyAuth, services_controller.service_scheduling_details);
router.delete('/scheduling/:id', login_controller.verifyEmployee, services_controller.service_scheduling_delete);
router.get('/scheduling/signals/:id', login_controller.verifyAuth, services_controller.service_scheduling_get_signals);

module.exports = router;
