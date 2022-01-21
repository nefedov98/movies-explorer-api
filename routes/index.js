const { Router } = require('express');
const { login, createUser, userLogout } = require('../controllers/user');
const { loginValidation, userValidation } = require('../middlewares/validate');

const router = Router();

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);
router.post('/signout', userLogout);

module.exports = router;
