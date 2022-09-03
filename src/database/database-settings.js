import sequelize from './database.js' 
import Character from '../models/character.model.js'
import Movie from '../models/movie.model.js'
import Genre from '../models/genre.model.js'


const databaseAssociations = async () => {
    try {
        /* 3D · Action · Adventure · Animated · Christmas · Comedy · Disney Channel · Documentary · Dog · Drama · Fantasy · History · Musical · Mystery · NEW · Princess · Romantic · Science Fiction · Spooky/Halloween · Sports · War · Western */
        // this creates these entries every time the server starts/restarts 
        await Genre.create({name: 'Animated', image: 'images/genres/animated.jpg'})
        await Genre.create({name: 'Live-action', image: 'images/genres/live-action.jpg'})
    } catch (error) {
        console.log('Associations error', error)
    }
}

export default databaseAssociations