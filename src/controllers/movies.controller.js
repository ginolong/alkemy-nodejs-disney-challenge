import Movie from '../models/movie.model.js'

export const getMovies = (req,res) => {
    res.send('getMovies')
}

export const getMovie = (req,res) => {
    res.send('getMovie')
}

export const createMovie = (req,res) => {
    res.send('createMovie')
}

export const updateMovie = (req,res) => {
    res.send('updateMovie')
}

export const deleteMovie = (req,res) => {
    res.send('deleteMovie')
}