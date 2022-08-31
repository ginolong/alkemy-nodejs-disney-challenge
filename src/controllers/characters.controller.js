import Character from '../models/character.model.js'

export const getCharacters = (req,res) => {
    res.send('getCharacters')
}

export const getCharacter = (req,res) => {
    res.send('getCharacter')
}

export const createCharacter = (req,res) => {
    res.send('createCharacter')
}

export const updateCharacter = (req,res) => {
    res.send('updateCharacter')
}

export const deleteCharacter = (req,res) => {
    res.send('deleteCharacter')
}

