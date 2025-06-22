const {Router} = require('express');
const { emailNotification } = require('../controllers/emailControllers');


const emailRouter = Router();

emailRouter.post('/', emailNotification)


module.exports = emailRouter;