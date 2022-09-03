import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/database/database.sqlite',
    //logging: (...msg) => console.log(msg)
    logging: false
})

//  Connection check
try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log(`Connected to the ${sequelize.getDialect()} database.`)
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

export default sequelize