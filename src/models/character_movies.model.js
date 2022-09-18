import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

/*
*   A unique constraint error would occur when associating a movie and a character with the same id.
*   Work around removing the composite id and setting unique: false at the association.
*   https://stackoverflow.com/questions/55322411/work-around-sequelize-s-unique-constraints-in-belongstomany-associations
*
*/

const Character_Movies = sequelize.define('Character_Movies', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false });

export default Character_Movies