const express = require('express');
const router  = express.Router();
const health_controller = require('../controllers/health_plan.controller');
const login_controller = require('../controllers/login.controller');

//Endpoints
router.get('/', login_controller.verifyAuth, health_controller.plan_get_all);
router.post('/create', login_controller.verifyEmployee, health_controller.plan_create);
router.put('/:name', login_controller.verifyEmployee,health_controller.plan_update);
router.delete('/:name', login_controller.verifyEmployee, health_controller.plan_delete);

module.exports = router;