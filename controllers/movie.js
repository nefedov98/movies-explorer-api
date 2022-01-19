const Movie = require('../models/movie');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { BadRequestError } = require('../errors/BadRequestError');

const getMovies = (req, res, next) => {
    Movie.find({})
        .then((movies) => res.send({ data: movies }))
        .catch(next);
};

const createMovie = (req, res, next) => {
    const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
    const owner = req.user._id;

    Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner })
        .then((movie) => res.send({ data: movie }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                throw new BadRequestError('Переданы некорректные данные');
            }
        })
        .catch(next);
};

const deleteMovie = (req, res, next) => {
    const userId = req.user._id;
    const { _id } = req.params;

    Movie.findById(_id)
        .orFail(() => {
            throw new NotFoundError('Карточка с таким id не найдена');
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                throw new BadRequestError('Переданы некорректные данные');
            }
        })
        .then((movie) => {
            if (movie.owner.toString() === userId) {
                Movie.findByIdAndRemove(_id)
                    .then((movieData) => res.send(movieData));
            } else {
                throw new ForbiddenError('Недостаточно прав!');
            }
        })
        .catch(next);
};

module.exports = {
    getMovies,
    createMovie,
    deleteMovie
};
