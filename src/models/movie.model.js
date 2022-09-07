import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js' 

/* TO DO: 
        Should rating be FLOAT?
        Validate year, only 4 integers (ex. 1994) min first disney movie 1937  - max current year
*/

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
        validate: { min: 1, max: 5 }
    },
}, {
    // Other model options go here
    timestamps: true,
    updatedAt: false
})

export default Movie