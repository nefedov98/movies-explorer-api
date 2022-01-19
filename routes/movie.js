const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

// const { cardValidation, idValidation } = require('../middlewares/validate');

router.get('/movies', getMovies);
router.post('/movies', createMovie);
router.delete('/movies/movieId', deleteMovie);

module.exports = router;
// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId 
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/movieId 
