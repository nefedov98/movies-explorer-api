const Movie = require('../models/movie');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { BadRequestError } = require('../errors/BadRequestError');
const { IS_NOT_OK, FORBIDDEN } = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(IS_NOT_OK);
      }
      throw err;
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const { _id } = req.params;

  Movie.findById(_id)
    .orFail()
    .catch(() => next(new BadRequestError(IS_NOT_OK)))
    .then((movie) => {
      if (movie.owner.toString() === ownerId) {
        return Movie.findByIdAndRemove(_id)
          .then((movieData) => res.send(movieData));
      }
      throw new ForbiddenError(FORBIDDEN);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
