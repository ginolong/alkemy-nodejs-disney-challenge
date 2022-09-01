import { Router } from 'express'
import {
    getMovies,
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie
} from '../controllers/movies.controller.js'

const router = Router()

router.get('/', getMovies)
router.get('/:id', getMovie)
router.post('/', createMovie)
router.patch('/:id', updateMovie)
router.delete('/:id', deleteMovie)

export default router