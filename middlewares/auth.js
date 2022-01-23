const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/AuthError');
const { AUTH } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const authorization = req.headers.cookie;
  console.log(req.cookies);
  console.log(authorization);

  if (!authorization || !authorization.startsWith('jwt=')) {
    throw new AuthError(AUTH);
  }

  const token = authorization.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthError(AUTH);
  }
  req.user = payload;

  next();
};

module.exports = auth;
