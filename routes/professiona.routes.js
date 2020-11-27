const express = require('express');
const router  = express.Router();
const professional_controller = require('../controllers/professional.controller');
const login_controller = require('../controllers/login.controller');

//Endpoints
router.get('/', login_controller.verifyAuth, professional_controller.professional_get_all);
router.post('/create', login_controller.verifyAuth, professional_controller.professional_create);
router.get('/:id', login_controller.verifyAuth, professional_controller.professional_detail);
router.put('/:id', login_controller.verifyAuth, professional_controller.professional_update);
router.delete('/:id', login_controller.verifyAuth, professional_controller.professional_delete);
router.post('/report/single', login_controller.verifyEmployee, professional_controller.professional_generate_report_single_date);
router.post('/report/simple', login_controller.verifyEmployee, professional_controller.professional_generate_simple_report);

module.exports = router;
