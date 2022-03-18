const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./help/limiter');
const router = require('./routes/index');
const { DEFAULT } = require('./utils/constants');
const { NODE_ENV } = process.env;

const BD_ADRESS = NODE_ENV === 'production' ? BD_ADRESS : 'mongodb://localhost:27017/moviesdb';

mongoose.connect(BD_ADRESS, {
  useNewUrlParser: true
});

const app = express();
console.log('Работает');

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(requestLogger);
app.use(limiter);
app.use(router);


app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? DEFAULT
        : message,
    });
  next();
});

const { PORT = 3000 } = process.env;

app.listen(PORT);
