/*
*   TO DO: 
*
*   Include a simple regex validation for length and special characters
*   Validations: https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
*   should id be uuid?
*
*   Read more about SQL injection using Sequelize, try testing with Snyk
*   https://docs.snyk.io/snyk-cli/cli-reference
*
*   Using bcrypt with sequelize:
*   DOC https://sequelize.org/docs/v6/other-topics/hooks/ 
*   https://stackoverflow.com/questions/34120548/using-bcrypt-with-sequelize-model
*/

import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js' 
import bcrypt from 'bcrypt'

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'The username must be a valid email'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            is: {
                args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                msg: 'Password must be between 8 and 16 characters long, containing at least one uppercase, one lowercase and a number.'
            }
        }
    },
}, {
    // Other model options go here
})

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 8)
})

User.prototype.isValidPassword = async function(password) { 
    return await bcrypt.compare(password, this.password); // this references user
}

export default User
