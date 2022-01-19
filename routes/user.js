const router = require('express').Router();

const { updateUser, getCurrentUser } = require('../controllers/user');

const { userUpdateValidation, idValidation } = require('../middlewares/validate');

router.get('/users/me', idValidation, getCurrentUser);
router.patch('/users/me', userUpdateValidation , updateUser);

module.exports = router;

// # возвращает информацию о пользователе (email и имя)
// GET /users/me

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me