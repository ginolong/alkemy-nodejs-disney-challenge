import express from 'express';
import morgan from 'morgan';

// Import Routes
import characterRoutes from './routes/characters.route.js'
import moviesRoutes from './routes/movies.route'
import usersRoutes from './routes/users.route'

const app = express()

// Middlewares
app.use(morgan('dev'))

// Routes
app.use('/characters', characterRoutes)
app.use('/movies', moviesRoutes)
app.use('/users', usersRoutes)

export default app