import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/database/database.sqlite',
    logging: (...msg) => console.log(msg),
    /*dialectOptions: {
        callback: (err) => {
            if (err) {
                return console.error(err.message)
            } else {
            console.log('Connected to the SQlite database.')}
        },
    },*/
})

try {
    await sequelize.authenticate();
    console.log('Connected to the SQlite database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

export default sequelize