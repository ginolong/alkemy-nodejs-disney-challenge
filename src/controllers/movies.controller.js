import Movie from '../models/movie.model.js'

export const getMovies = async (req,res,next) => {
    try {
        const allMovies = await Movie.findAll({
            attributes: ['id', 'image', 'title', 'year']
        })
        console.log(allMovies)
        if (!allMovies.length)
            throw new Error (`There are no movies created yet.`)
        res.send(allMovies)   
    } catch (error) {
        next(error)
    }
}

export const getMovie = async (req,res,next) => {
    try {
        const id = req.params.id
        const movie = await Movie.findByPk(id)
        if (!movie)
            throw new Error (`Movie with id: ${id}, doesn't exists.`)
        res.send(movie)
    } catch (error) {
        next(error)
    }
}

export const createMovie = async (req,res,next) => {
    try {
/*         const { image, title, year, rating } = req.body
        const newMovie = await Movie.build ({
            image, 
            title,
            year,
            rating,
        }) */
        const newMovie = Movie.build (req.body)
        // validate newMovie through service: validateMovie(newMovie)
        await newMovie.save()
        res.json(newMovie)
    } catch (error) {
        next(error)
    }
}

export const updateMovie = async (req,res,next) => {
    try {
        const id = req.params.id
        const movieToUpdate = await Movie.findByPk(id)
        // TO DO: Check if pk exists, characterToUpdate is not empty. Send to validation & error handling services
        const oldMovieTitle = movieToUpdate.title
        await movieToUpdate.update(req.body)
        res.send(
            `Movie ${oldMovieTitle} (Id: ${id}) was successfully updated to: 
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