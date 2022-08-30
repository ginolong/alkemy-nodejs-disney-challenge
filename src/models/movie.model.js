import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js' 

// TO DO: Validate rating 1 to 5
// Include timestamp for 'Created at' field

const Movie = sequelize.define('Movie', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        isUnique: true,
    },
    image: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.INTEGER,
    },
}, {
    // Other model options go here
})

export default Movie