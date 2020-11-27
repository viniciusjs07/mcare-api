const express = require('express');
const router  = express.Router();
const employee_controller = require('../controllers/employee.controller');
const login_controller = require('../controllers/login.controller');

//Endpoints
router.get('/', login_controller.verifyEmployee, employee_controller.employee_get_all);
router.post('/create', login_controller.verifyEmployee, employee_controller.employee_create);
router.get('/:id', login_controller.verifyEmployee, employee_controller.employee_detail);
router.put('/:id', login_controller.verifyEmployee, employee_controller.employee_update);
router.delete('/:id', login_controller.verifyEmployee, employee_controller.employee_delete);

module.exports = router;