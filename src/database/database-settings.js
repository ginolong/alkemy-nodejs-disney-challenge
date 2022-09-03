import sequelize from './database.js' 
import Character from '../models/character.model.js'
import Movie from '../models/movie.model.js'
import Genre from '../models/genre.model.js'

/*
*
*   Related doc to associations:
*   https://sequelize.org/docs/v6/core-concepts/assocs/
*   https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
*
*/

const databaseAssociations = async () => {
    try {
        // One to Many association
        Movie.belongsTo(Genre, { as: 'genre' }) // it's important to define associations before sequelize.sync

        await sequelize.sync()
        await generateGenres() // Creates genres to work with movies, since users can't create them according to technical requirements

    } catch (error) {
        console.log('Associations error', error)
    }
}

const generateGenres = async () => {
    try {
        /* 3D · Action · Adventure · Animated · Christmas · Comedy · Disney Channel · Documentary · Dog · Drama · Fantasy · History · Musical · Mystery · NEW · Princess · Romantic · Science Fiction · Spooky/Halloween · Sports · War · Western */
        await Genre.findOrCreate({
            where: {
                name: 'Live-action'
            },
            defaults: {
                name: 'Live-action',
                image: 'images/genres/live-action.jpg'
            }
        })
        await Genre.findOrCreate({
            where: {
                name: 'Animated'
            },
            defaults: {
                name: 'Animated',
                image: 'images/genres/animated.jpg'
            }
        })
    } catch (error) {
        console.log("Couldn't generate genres ", error)
    }
}

export default databaseAssociations