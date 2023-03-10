import { Type, Joke } from "./db-connection.js"

const deliveryHost = '20.21.246.173:80'

let  types = []

export const getJokes = async () => await Joke.find({ approvalStatus: 'pending' })

export const getAllJokes = async () => await Joke.find()

export const addJoke = (joke) => {
    console.log(joke)
    if (validateJoke(joke) == '') {
        joke = new Joke(joke)
        joke.save().then(() => console.log(new Date(), ' Added new joke: ', joke))
        return true
    }
    return validateJoke(joke)
}

export const validateJoke = (joke) => {
    var check = ''
    if (joke.type == '' || joke.type == undefined) check += 'Joke must contain a valid type! \n '
    if (joke.setup == '' || joke.setup == undefined) check += 'Joke must contain a setup! \n '
    if (joke.punchline == '' || joke.punchline == undefined) check += 'Joke must contain a punchline! \n '
    joke.approvalStatus = "pending"
    return check
}

export const getJokeById = async (id) => {
    return await Joke.findById(id)
}

export const deleteJoke = async (id) => {
    await Joke.findByIdAndDelete({ _id: id })
    return (await Joke.count({ _id: id }) == 0) 
}

export const fetchTypes = async () => {
    try {
        types = await (await fetch(`http://${deliveryHost}/gettypes`)).json()
        const mongoTypes = await Type.find()
        types.forEach(type => {
            if (!mongoTypes.includes(type)) {
                type = new Type(type)
                type.save().then(() => console.log(new Date(), 'Added new type: ', type))
            }
        })
    }
    catch (err) {
        types = Type.find()
        console.log("Delivery down: Loaded types from MongoDB!")
        console.log("Error: ", err)
    }
}

export const acceptJoke = async (id, approvalStatus) => {
    try {
        console.log(id, " and ", approvalStatus)
        if (!['pending', 'approved', 'declined'].includes(approvalStatus)) throw new Error("Approval status not valid!")
        await Joke.updateOne({ _id: id }, { approvalStatus: approvalStatus })
        const joke = await Joke.findById(id)
        return joke
    }
    catch (error) {
        console.log(error)
        return false
    }
}

export const getTypes = async () => await types

export const updateJoke = async (id, joke) => {
    try {
        console.log(joke.type)
        if (validateJoke(joke) != '') throw new Error()
        await Joke.updateOne({ _id: id }, { type: joke.type, setup: joke.setup, punchline: joke.punchline })
        const res = await Joke.findById(id)
        return res
    } catch (err) {
        console.log(err)
        return false
    }
}