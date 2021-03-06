const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

const { idValidation, movieIdValidator } = require('../middlewares/validate');

router.get('/movies', getMovies);
router.post('/movies', idValidation, createMovie);
router.delete('/movies/:movieId', movieIdValidator, deleteMovie);

module.exports = router;
// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/movieId
