import sequelize from './database.js' 
import Character from '../models/character.model.js'
import Movie from '../models/movie.model.js'
import Genre from '../models/genre.model.js'
import User from '../models/user.model.js'

const user = 
    { 
        email: "user@test.com", 
        password: "aNumberAnd8chars"
    }

const genres = [
    {
        name: 'Live-action',
        image: 'images/genres/live-action.jpg'
    },
    {
        name: 'Animated',
        image: 'images/genres/animated.jpg'
    },
    {
        name: 'Fantasy',
        image: 'images/genres/fantasy.jpg'
    },
    {
        name: 'Christmas',
        image: 'images/genres/christmas.jpg'
    }
]

const movies = [
    {
        image: "images/movies/toy_story.jpg",
        title: "Toy Story",
        year: 1995,
        rating: 4,
        genreId: 2
    },
    {
        image: "images/movies/dinosaur.jpg",
        title: "Dinosaur",
        year: 2000,
        rating: 3,
        genreId: 2
    },
    {
        image: "images/movies/alice_in_wonderland.jpg",
        title: "Alice in Wonderland",
        year: 1951,
        rating: 5,
        genreId: 3
    },
    {
        image: "images/movies/jingle_all_the_way.jpg",
        title: "Jingle All the Way",
        year: 1996,
        rating: 3,
        genreId: 4
    },
    {
        image: "images/movies/toy_story_2.jpg",
        title: "Toy Story 2",
        year: 1999,
        rating: 2,
        genreId: 2
    },
]

// Characters

const characters = [
    {   
        image: "images/characters/mickey.jpg",
        name: "Woody",
        age: 28,
        weight: 80,
        backstory: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {   
        image: "images/characters/mickey.jpg",
        name: "Alice",
        age:  7,
        weight: 55,
        backstory: "Purus sit amet volutpat consequat. In metus vulputate eu scelerisque felis imperdiet proin fermentum.",
    },
    {   
        image: "images/characters/mickey.jpg",
        name: "Buzz",
        age: 32,
        weight: 120,
        backstory: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    },
    {   
        image: "images/characters/mickey.jpg",
        name: "Howard Langston",
        age: 41,
        weight: 180,
        backstory: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {   
        image: "images/characters/mickey_mouse.jpg",
        name: "Mickey Mouse",
        age: 94,
        weight: 45,
        backstory: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
]

const mockData = async (req, res, next) => {
    try {
        await sequelize.sync({ force: true })
        await User.create(user)
        for (const genre of genres) {
            await Genre.create(genre)
        }
        for (const movie of movies) {
            await Movie.create(movie)
        }
        for (const character of characters) {
            await Character.create(character)
        }

        // Random movie-character association
        for (let movieId = 1; movieId <= movies.length; movieId++) {
            const editMovie = await Movie.findByPk(movieId)
            const editCharacter = await Character.findByPk(movieId)
            const random = Math.floor(Math.random() * (characters.length - 1) + 1)
            editMovie.setCharacters(random)
            editCharacter.setMovies(random)
        }
    } catch (error) {
        console.log(error)
    }
}

export default mockData