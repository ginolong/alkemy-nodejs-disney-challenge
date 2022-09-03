import express from 'express'
import morgan from 'morgan'
import databaseSettings from './database/database-settings.js'

// Import Routes
import characterRoutes from './routes/characters.route.js'
import moviesRoutes from './routes/movies.route.js'
import authRoutes from './routes/auth.route.js'

const app = express()
databaseSettings() // database associations and connection

// Middleware
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/characters', characterRoutes)
app.use('/movies', moviesRoutes)
app.use('/auth', authRoutes)

export default app