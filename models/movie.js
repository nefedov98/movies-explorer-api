const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
// const { AuthError } = require('../errors/AuthError');
const linkRegExp = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+#*/;

const movieSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator(link) {
                return linkRegExp.test(link);
            },
            message: 'Здесь должна быть ссылка',
        },
    },
    trailer: {
        type: String,
        required: true,
        validate: {
            validator(link) {
                return linkRegExp.test(link);
            },
            message: 'Здесь должна быть ссылка',
        },
    },
    thumbnail: {
        type: String,
        required: true,
        validate: {
            validator(link) {
                return linkRegExp.test(link);
            },
            message: 'Здесь должна быть ссылка',
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    movieId: {
        type: Number,
        ref: 'movie',
        required: true,
    },
    nameRU: {
        type: String,
        required: true,
    },
    nameEN: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('movie', movieSchema);