import Character from '../models/character.model.js'

export const getCharacters = async (req,res,next) => {
    try {
        //throw new Error("test error")
        const allCharacters = await Character.findAll()
        res.send(allCharacters)   
    } catch (error) {
        next(error)
    }
}

export const getCharacter = async (req,res,next) => {
    try {
        const id = req.params.id
        const character = await Character.findByPk(id)
        res.send(character)   
    } catch (error) {
        next(error)
    }
}

export const createCharacter = async (req,res,next) => {
    try {
        //throw new Error("test error")
        const { image, name, age, weight, backstory } = req.body
        const newCharacter = await Character.create ({
            image, 
            name, 
            age, 
            weight, 
            backstory
        })
        res.json(newCharacter)
    } catch (error) {
        next(error)
    }
}

export const updateCharacter = async (req,res,next) => {
    try {
        const id = req.params.id
        const characterToUpdate = await Character.findByPk(id)
        const oldCharacterName = characterToUpdate.name
        await characterToUpdate.update(req.body)
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
        await characterToDelete.destroy()
        res.send(`Character ${characterToDelete.name} (Id: ${id}) was successfully deleted.`)
    } catch (error) {
        next(error)
    }
}