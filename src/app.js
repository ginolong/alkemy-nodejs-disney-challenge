import express from 'express'
import morgan from 'morgan'
import { passportAuthToken }  from './services/auth.service.js'
import databaseSettings from './database/database-settings.js'
import mockData from './database/mockdata.js'

// Import Routes
import characterRoutes from './routes/characters.route.js'
import moviesRoutes from './routes/movies.route.js'
import authRoutes from './routes/auth.route.js'

const app = express()
databaseSettings() // database associations

if (process.env.MOCK_DATA = true)
    mockData()

// Middleware
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/characters', passportAuthToken, characterRoutes)
app.use('/movies', passportAuthToken, moviesRoutes)
app.use('/auth', authRoutes)

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.json({ error: err.message })
})

export default app