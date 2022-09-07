import Character from '../models/character.model.js'
import Movie from '../models/movie.model.js'
import { Op } from 'sequelize'

export const getCharacters = async (req,res,next) => {
    try {
        if (!Object.keys(req.query).length) { // if there is no query, find all with no parameters
            let allCharacters = await Character.findAll()
            if (!allCharacters.length)
                allCharacters = 'There are no characters created yet.'
            res.json(allCharacters)
        } else {
            let { name = '', age = '', weight = '', movies = '' } = req.query // default value '' matches any result, in case that parameter is not in the query TO DO validate query 

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
                    attributes: [] // No need to show any attributes, just confirm the association
                },
                attributes: ['id', 'image', 'name'] // 'id' attribute only for delete testing, remove before prod
            })

            if (!characters.length)
                characters = 'No characters were found.' // move to validation & error handling services
            res.json(characters)   
        }
    } catch (error) {
        next(error)
    }
}

export const getCharacter = async (req,res,next) => {
    try {
        const id = req.params.id
        const character = await Character.findByPk(id, {include: Movie })
        if (!character)
            throw new Error (`Character with id: ${id}, doesn't exists.`) // move to validation & error handling services
        res.send(character)
    } catch (error) {
        next(error)
    }
}

export const createCharacter = async (req,res,next) => {
    try {
        const { image, name, age, weight, backstory, moviesId } = req.body // TO DO send to validation & error handling services
        console.log(moviesId)
        const newCharacter = await Character.build ({
            image, 
            name, 
            age, 
            weight, 
            backstory
        })
        newCharacter.addMovies(moviesId) // it's not asynchronous, because it's not in the database yet (build)
        
        await newCharacter.save()
        res.json(newCharacter)
    } catch (error) {
        next(error)
    }
}

export const updateCharacter = async (req,res,next) => {
    try {
        const id = req.params.id
        const characterToUpdate = await Character.findByPk(id)
        // TO DO: Check if pk exists, characterToUpdate is not empty. Send to validation & error handling services
        const oldCharacterName = characterToUpdate.name
        await characterToUpdate.update(req.body) // send to validation & error handling services
        await characterToUpdate.setMovies(req.body.moviesId) // TO DO validate moviesId existence

        res.send(
            `Character ${oldCharacterName} (Id: ${id}) was successfully updated to: 
            <pre> ${JSON.stringify(characterToUpdate.dataValues, null, 4)} </pre>`
        )
    } catch (error) {
        next(error)
    }
}

export const deleteCharacter = async (req,res,next) => {
    try {
        const id = req.params.id
        const characterToDelete = await Character.findByPk(id)
        if (!characterToDelete)
            throw new Error (`Can't delete a Character with a non-existent Id: ${id}`) // move to validation & error handling services
        await characterToDelete.destroy()
        res.send(`Character ${characterToDelete.name} (Id: ${id}) was successfully deleted.`)
    } catch (error) {
        next(error)
    }
}