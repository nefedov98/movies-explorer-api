const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');
const {
  AUTH_SUCCES, LOGOUT_SUCCES, CONFLICT, NOT_FOUND_USER, IS_NOT_OK,
} = require('../utils/constants');

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
      if (err.code === 11000) {
        throw new ConflictError(CONFLICT);
      } else if (err.name === 'CastError') {
        throw new BadRequestError(IS_NOT_OK);
      }
      throw err;
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_USER);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError(IS_NOT_OK);
      } else if (err.code === 11000) {
        throw new ConflictError(CONFLICT);
      }
      throw err;
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_USER);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(IS_NOT_OK);
      }
      throw err;
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

      res.send({ token });
    })
    .catch(next);
};

const userLogout = (req, res) => {
  res.clearCookie('jwt').send({ message: LOGOUT_SUCCES });
};

module.exports = {
  createUser,
  updateUser,
  getCurrentUser,
  login,
  userLogout,
};
