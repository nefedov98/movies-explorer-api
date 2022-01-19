const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errors } = require('celebrate');
const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');
const auth = require('./middlewares/auth');
const { login, createUser, userLogout } = require('./controllers/user'); 
const { NotFoundError } = require('./errors/NotFoundError');
const { loginValidation, userValidation } = require('./middlewares/validate');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const app = express();
console.log("Работает")

app.use(express.json());

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
app.use(requestLogger);
app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);
app.post('/signout', userLogout);

app.use('/', auth, userRouter);
app.use('/', auth, movieRouter);

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger)

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

const { PORT = 3000 } = process.env;

app.listen(PORT);