import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js' 

const Genre = sequelize.define('Genre', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        isUnique: true,
    },
    image: {
        type: DataTypes.STRING,
    },
}, {
    // Other model options go here
})

export default Genre