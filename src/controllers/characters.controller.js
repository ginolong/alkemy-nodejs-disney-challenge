import Character from '../models/character.model.js'
import Movie from '../models/movie.model.js'
import { Op } from 'sequelize'

/******************************************************************************************

TO DO list:

    - Validate requests fields.
    - Update movie association upon deletion.
    - Clear controller, move existing validation and error handling to dedicated services.
    - Use in updateCharacter the same movies association validations as in createCharacter (as a service)

*******************************************************************************************/

export const getCharacters = async (req,res,next) => {
    try {
        // if there isn't a query, then findAll
        if (!Object.keys(req.query).length) {
            let allCharacters = await Character.findAll({ attributes: ['image', 'name'] })
            if (!allCharacters.length) {
                return res.status(200).json({ message: 'There are no characters created yet.' })
            }
            return res.status(200).json(allCharacters)

        // if there is a query, then search and filter
        } else {
            // default value '' matches any result, in case that query is not present
            let { name = '', age = '', weight = '', movies = '' } = req.query

            let characters = await Character.findAll({
                where: {
                    name: { 
                        [Op.substring]: name // Op.substring works as 'contains', it isn't case sensitive - DOC -> https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
                    },
                    age: {
                        [Op.substring]: age
                    },
                    weight: {
                        [Op.substring]: weight
                    }
                },
                include: {  
                    model: Movie,
                    where: {    // filter at the associated model level - DOC https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
                        id: {
                            [Op.substring]: movies  // works with arrays too: ?movies=1&movies=2&movies=3
                        }
                    },
                    attributes: [] // No need to show any attributes, used just to confirm the association
                },
                attributes: ['image', 'name']
            })

            // If no characters were found, return empty json 
            return res.status(200).json(characters)   
        }
    } catch (error) {
        next(error)
    }
}

export const getCharacter = async (req,res,next) => {
    try {
        const id = req.params.id
        const character = await Character.findByPk(id, {include: Movie })

        // Character existence validation
        if (!character) {
            const error = new Error(`Character with Id ${id} not found.`)
            error.status = 404
            throw error
        }

        return res.status(200).json(character)
    } catch (error) {
        next(error)
    }
}

export const createCharacter = async (req,res,next) => {
    try {
        const { image, name, age, weight, backstory, moviesId } = req.body
        const newCharacter = Character.build ({ // it's not asynchronous, because it's not in the database yet (build)
            image, 
            name, 
            age, 
            weight, 
            backstory
        })

        // Movies existence validation
        if (moviesId) {
            let movieExists = ''
            for (const id of moviesId) {
                movieExists = await Movie.findByPk(id)
                if (!movieExists) {
                    const error = new Error(`Can't associate with non-existent resource. Movie with Id ${id} not found.`)
                    error.status = 400
                    throw error
                }
            }
        }

        newCharacter.addMovies(moviesId)
        await newCharacter.save()

        // Return created character, including movie associations
        const createdCharacter = await Character.findByPk(
            newCharacter.id, 
            { include: Movie }
        )
        return res.status(201).json(createdCharacter)
        //return res.status(201).json(newCharacter)
    } catch (error) {
        next(error)
    }
}

export const updateCharacter = async (req,res,next) => {
    try {
        const id = req.params.id
        const characterToUpdate = await Character.findByPk(id)

        // Validate character existence
        if (!characterToUpdate) {
            const error = new Error(`Can't update non-existent resource. Character with Id ${id} not found.`)
            error.status = 400
            throw error
        }

        await characterToUpdate.update(req.body)

        // TO DO: validate movies to associate (exactly as createCharacter, make it a service that can be used both for movies and characters )
        await characterToUpdate.setMovies(req.body.moviesId)
        const characterUpdated = await Character.findByPk(id, {include: Movie })
        return res.status(200).json(characterUpdated)
    } catch (error) {
        next(error)
    }
}

export const deleteCharacter = async (req,res,next) => {
    try {
        const id = req.params.id
        const characterToDelete = await Character.findByPk(id)

        // Validate character existence
        if (!characterToDelete) {
            const error = new Error(`Can't delete non-existent resource. Character with Id ${id} not found.`)
            error.status = 400
            throw error
        }

        await characterToDelete.destroy()
        return res.status(200).json({ message: `Character ${characterToDelete.name} (Id: ${id}) was successfully deleted.` })
    } catch (error) {
        next(error)
    }
}