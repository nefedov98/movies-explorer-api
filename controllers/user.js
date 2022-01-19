const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10)
        .then((hash) => User.create({
            name, email, password: hash,
        }))
        .then((user) => res.send({
            data: {
                name: user.name, email: user.email,
            },
        }))
        .catch((err) => {
            if (err.name === 'MongoError' && err.code === 11000) {
                throw new ConflictError('Пользователь с таким email уже существует');
            } else if (err.name === 'ValidationError') {
                throw new BadRequestError('Переданы некорректные данные');
            }
        })
        .catch(next);
};

const updateUser = (req, res, next) => {
    const { name, about } = req.body;
    const userId = req.user._id;

    User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
        .orFail(() => {
            throw new NotFoundError('Пользователь с таким id не найден');
        })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                throw new BadRequestError('Переданы некорректные данные');
            } else if (err.name === 'CastError') {
                throw new BadRequestError('Переданы некорректные данные');
            }
        })
        .catch(next);
};

const getCurrentUser = (req, res, next) => {
    console.log(req.id)
    User.findById(req.user._id)
        .orFail(() => {
            throw new NotFoundError('Пользователь с таким id не найден');
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                throw new BadRequestError('Переданы некорректные данные');
            }
        })
        .then((currentUser) => res.send({ currentUser }))
        .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send(token);
    })
    .catch(next);
};

const userLogout = (req, res) => {
    res.clearCookie('jwt').send({ message: "Вы успешно разлогинились!" });
  };

module.exports = {
    createUser,
    updateUser,
    getCurrentUser,
    login,
    userLogout
};
