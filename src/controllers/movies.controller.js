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
        const movie = await Movie.findByPk(req.params.id)
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
        const { image, title, year, rating, genreId } = req.body
        const newMovie = await Movie.build ({
            image, 
            title,
            year,
            rating,
            genreId
        })
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
        await movieToUpdate.update(req.body)
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