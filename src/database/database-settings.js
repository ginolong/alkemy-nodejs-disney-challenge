import sequelize from './database.js' 
import Character from '../models/character.model.js'
import Movie from '../models/movie.model.js'
import Genre from '../models/genre.model.js'
import Character_Movies from '../models/character_movies.model.js'

/*
*   Related doc to associations:
*   https://sequelize.org/docs/v6/core-concepts/assocs/
*   https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
*   https://stackoverflow.com/questions/55322411/work-around-sequelize-s-unique-constraints-in-belongstomany-associations
*/

const databaseAssociations = async () => {
    try {
        // One to Many association
        Movie.belongsTo(Genre, { as: 'genre' }) 
        
        // Many to Many association
        Movie.belongsToMany(Character, { through: { model: Character_Movies, unique: false } })
        Character.belongsToMany(Movie, { through: { model: Character_Movies, unique: false } })

        await sequelize.sync() // it's important to define associations before sequelize.sync
    } catch (error) {
        console.log('Associations error', error)
    }
}

export default databaseAssociations