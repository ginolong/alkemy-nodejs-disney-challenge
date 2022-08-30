import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js' 

const Character = sequelize.define('Character', {
    image: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
    },
    weight: {
        type: DataTypes.FLOAT, // pounds
    },
    backstory: {
        type: DataTypes.TEXT,
    }
}, {
    // Other model options go here
})

export default Character