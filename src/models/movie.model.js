import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js' 

// TO DO: Validate rating 1 to 5
// Include timestamp for 'Created at' field

const Movie = sequelize.define('Movie', {
    image: {
        type: DataTypes.STRING,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        isUnique: true,
    },
    rating: {
        type: DataTypes.INTEGER,
    },
}, {
    // Other model options go here
})

export default Movie