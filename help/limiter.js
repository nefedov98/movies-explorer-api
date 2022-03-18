const rateLimit = require('express-rate-limit');
const { LIMITER_MSG } = require('../utils/constants');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: LIMITER_MSG,
});

module.exports = limiter;
