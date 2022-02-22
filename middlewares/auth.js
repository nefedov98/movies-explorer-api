const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/AuthError');
const { AUTH } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const authorization = req.headers.cookie;
  const { asas } = req.headers;
  console.log(1);
  console.log(req.headers);
  console.log(2);
  console.log(authorization);
  console.log(3);
  console.log(asas);

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
