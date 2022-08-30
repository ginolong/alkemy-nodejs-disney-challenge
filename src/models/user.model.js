import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js' 

/*
*   Sequelize handles automatically an id as pk in the query.
*   To define a custom one use the constraint primaryKey: true
*/


// TO DO: include a simple regex validation for length and special characters
// Validations: https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
// should id of use be uuid?

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true,
        isUnique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // Other model options go here
})

// console.log('User Model:', User === sequelize.models.User)

export default User
