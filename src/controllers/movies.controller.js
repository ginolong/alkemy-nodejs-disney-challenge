import Movie from '../models/movie.model.js'
import Character from '../models/character.model.js'
import Genre from '../models/genre.model.js'
import { Op } from 'sequelize'

/******************************************************************************************

TO DO list:

    - Validate requests fields.
    - Update character association upon deletion.
    - Clear controller, move existing validation and error handling to dedicated services.
    - Use in updateMovie the same genre and character association validations as in createMovie (as a service)

*******************************************************************************************/

export const getMovies = async (req, res, next) => {
    try {
        // If there isn't a query, then findAll
        if (!Object.keys(req.query).length) {
            let allMovies = await Movie.findAll({ attributes: ['image', 'title', 'createdAt'] })
            if (!allMovies) {
                return res.status(200).json({ message: 'There are no movies created yet.' })
            }
            return res.status(200).json(allMovies)

        // if there is a query, then search and filter
        } else {
            // default value '' matches any result, in case that query is not present
            let { title = '', genre = '', order } = req.query
            let orderedByTime = []

            // order is ASC by default, this only checks DESC to prevent wrong query parameters
            if (order === 'DESC')
                orderedByTime = [['createdAt', order]]

            let movies = await Movie.findAll({
                where: {
                    title: {
                        [Op.substring]: title // Op.substring works as 'contains' - DOC -> https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
                    },
                    genreId: {
                        [Op.substring]: genre
                    }
                },
                order: orderedByTime,
                attributes: ['image', 'title', 'createdAt']
            })

            // If no movies were found, return empty json 
            return res.status(200).json(movies)
        }
    } catch (error) {
        next(error)
    }
}

export const getMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByPk(req.params.id, { include: Character })

        // Movie existence validation
        if (!movie) {
            const error = new Error(`Movie with Id ${req.params.id} not found.`)
            error.status = 404
            throw error
        }

        return res.status(200).json(movie)
    } catch (error) {
        next(error)
    }
}

export const createMovie = async (req, res, next) => {
    try {
        const { image, title, year, rating, genreId, charactersId } = req.body

        // Genre existence validation
        if (genreId) {
            const genreExists = await Genre.findByPk(genreId)
            if (!genreExists) {
                const error = new Error(`Can't associate with non-existent resource. Genre with Id ${genreId} not found.`)
                error.status = 400
                throw error
            }
        }
        
        const newMovie = Movie.build({ // it's not asynchronous, because it's not in the database yet (build)
            image,
            title,
            year,
            rating,
            genreId
        })

        // Characters existence validation
        if (charactersId) {
            let characterExists = ''
            for (const id of charactersId) {
                characterExists = await Character.findByPk(id)
                if (!characterExists) {
                    const error = new Error(`Can't associate with non-existent resource. Character with Id ${id} not found.`)
                    error.status = 400
                    throw error
                }
            }
        }

        newMovie.addCharacters(charactersId)
        await newMovie.save()
        return res.status(201).json(newMovie)
    } catch (error) {
        next(error)
    }
}

export const updateMovie = async (req, res, next) => {
    try {
        const movieToUpdate = await Movie.findByPk(req.params.id)

        // Validate movie existence
        if (!movieToUpdate) {
            const error = new Error(`Can't update non-existent resource. Movie with Id ${req.params.id} not found.`)
            error.status = 400
            throw error
        }

        // TO DO: validate characters to associate (exactly as createMovie, make it a service that can be used both for movies and characters ), and movie genre.

        await movieToUpdate.update(req.body)
        await movieToUpdate.setCharacters(req.body.charactersId)
        const movieUpdated = await Movie.findByPk(req.params.id, { include: Character })
        return res.status(200).json(movieUpdated)
    } catch (error) {
        next(error)
    }
}

export const deleteMovie = async (req, res, next) => {
    try {
        const id = req.params.id
        const movieToDelete = await Movie.findByPk(id)

        // Validate movie existence
        if (!movieToDelete) {
            const error = new Error(`Can't delete non-existent resource. Movie with Id ${id} not found.`)
            error.status = 400
            throw error
        }

        await movieToDelete.destroy()
        return res.status(200).json({ message: `Movie ${movieToDelete.title} (Id: ${id}) was successfully deleted.` })
    } catch (error) {
        next(error)
    }
}