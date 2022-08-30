import express from 'express';
import morgan from 'morgan';
import sequelize from './database/database.js';
import User from './models/user.model.js'
// Import Routes
import characterRoutes from './routes/characters.route.js'
import moviesRoutes from './routes/movies.route.js'
import usersRoutes from './routes/users.route.js'

const app = express();

// Middlewares
app.use(morgan('dev'))

// Routes
app.use('/characters', characterRoutes)
app.use('/movies.', moviesRoutes)
app.use('/users', usersRoutes)

export default app;