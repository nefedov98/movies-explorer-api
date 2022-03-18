const { Router } = require('express');
const userRouter = require('./user');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');
const { login, createUser, userLogout } = require('../controllers/user');
const { loginValidation, userValidation } = require('../middlewares/validate');
const { NotFoundError } = require('../errors/NotFoundError');
const { NOT_FOUND } = require('../utils/constants');

const router = Router();

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);
router.post('/signout', userLogout);

router.use('/', auth, userRouter);
router.use('/', auth, movieRouter);

router.use('*', () => {
  throw new NotFoundError(NOT_FOUND);
});

module.exports = router;
