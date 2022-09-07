import Movie from '../models/movie.model.js'
import Character from '../models/character.model.js'
import { Op } from 'sequelize'

/* export const getMovies = async (req,res,next) => {
    try {
        console.log('QUERY', req.query)

        let movies = ''
        let { title, genre, order } = req.query

        let orderedByTime = []
        if (order === 'DESC')
            orderedByTime = [['createdAt', order]] // order is ASC by default, this only checks DESC to prevent wrong query parameters

        if (!req.query.title)
            title = '' // this will match every title

        if (!genre) {
            movies = await Movie.findAll({
                where: { 
                    title: { 
                        [Op.substring]: title // Op.substring works as 'contains' - DOC -> https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
                    }, 
                },
                order: orderedByTime,
                attributes: ['id', 'image', 'title', 'createdAt']
            })
        } else {
            movies = await Movie.findAll({
                where: { 
                    title: { 
                        [Op.substring]: title 
                    },
                    genreId: genre // Can't find a way to make a field optional, perhaps a fn? Had to replicate the entire block to include genre in case it's in query
                },
                order: orderedByTime,
                attributes: ['id', 'image', 'title', 'createdAt']
            })
        }
        res.send(movies)
    } catch (error) {
        next(error)
    }
} */

export const getMovies = async (req,res,next) => {
    try {
        console.log('QUERY', req.query)

        let movies = ''
        let { title, genre, order } = req.query

        let orderedByTime = []
        if (order === 'DESC') // order is ASC by default, this only checks DESC to prevent wrong query parameters
            orderedByTime = [['createdAt', order]] 

        if (!req.query.title)
            title = '' // this will match every title

        if (!genre)
            genre = '' // this will match every genre

        movies = await Movie.findAll({
            where: { 
                title: { 
                    [Op.substring]: title // Op.substring works as 'contains' - DOC -> https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
                }, 
                genreId: {
                    [Op.substring]: genre
                }
            },
            order: orderedByTime,
            attributes: ['id', 'image', 'title', 'createdAt']
        })

        if (!movies.length)
            throw new Error (`No movies were found.`) 
            
        res.send(movies)
    } catch (error) {
        next(error)
    }
}

export const getMovie = async (req,res,next) => {
    try {
        const movie = await Movie.findByPk(req.params.id, {include: Character })
        //console.log((await mov.getGenre()).name)
        if (!movie)
            throw new Error (`Movie with id: ${req.params.id}, doesn't exists.`)
        res.send(movie)
    } catch (error) {
        next(error)
    }
}

export const createMovie = async (req,res,next) => {
    try {         
        const { image, title, year, rating, genreId, charactersId } = req.body
        const newMovie = await Movie.build ({
            image, 
            title,
            year,
            rating,
            genreId
        })
        if (charactersId.length) {
            // FIX if you try to add a non-existent character it crashes, validate
            newMovie.addCharacters(charactersId) // it's not asynchronous, because it's not in the database yet (build)
        }
        /*
        validate newMovie fields through service: validateMovie(newMovie, genre)
        validate genre and check if it exists with findbypk(genre), if it does then: newMovie.setGenre(genre)
        const genre = await Genre.findByPk(req.body.genreId)
        */
        await newMovie.save()
        res.json(newMovie)
    } catch (error) {
        next(error)
    }
}

export const updateMovie = async (req,res,next) => {
    try {
        const movieToUpdate = await Movie.findByPk(req.params.id)
        // TO DO: Check if pk exists, characterToUpdate is not empty. Send to validation & error handling services
        const oldMovieTitle = movieToUpdate.title
        await movieToUpdate.update(req.body) // validate fields
        await movieToUpdate.setCharacters(req.body.charactersId) // TO DO validate charactersId existence

        res.send(
            `Movie ${oldMovieTitle} (Id: ${req.params.id}) was successfully updated to: 
            <pre> ${JSON.stringify(movieToUpdate.dataValues, null, 4)} </pre>`
        )
    } catch (error) {
        next(error)
    }
}

export const deleteMovie = async (req,res,next) => {
    try {
        const id = req.params.id
        const movieToDelete = await Movie.findByPk(id)
        if (!movieToDelete)
            throw new Error (`Can't delete a Movie with a non-existent Id: ${id}`)
        await movieToDelete.destroy()
        res.send(`Movie ${movieToDelete.title} (Id: ${id}) was successfully deleted.`)
    } catch (error) {
        next(error)
    }
}