import express from 'express';
import morgan from 'morgan';
import sequelize from './database/database.js';
import User from './models/user.model.js'
// Import Routes
import characterRoutes from './routes/characters.route.js'
import moviesRoutes from './routes/movies.route.js'
import authRoutes from './routes/auth.route.js'

const app = express();

// Middlewares
app.use(morgan('dev'))

// Routes
app.use('/characters', characterRoutes)
app.use('/movies', moviesRoutes)
app.use('/auth', authRoutes)

export default app;