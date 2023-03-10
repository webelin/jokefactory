import { query } from './db-connection.js'

var types = []

export const init = async () => {
    types = [...await getTypes(), {id: -1, type: 'any'}]
    if (types == []) throw new Error('No db connection')
}

export const getJokes = async (req) => {
    var params = req.params.type.split('&')
    const type = (params[0] == undefined) ? params[0] = 'any' : params[0]
    var count = 1
    if (params.length > 1) {
        count = (isNaN(Number(params[1]))) ? 1 : Number(params[1]);
    }
    if (!types.map(x => x = x.type).includes(type)) return ("Unknown Parameter!");
    if (count == undefined || count < 1) count = 1;
    if (type == 'any') return await query(`SELECT * FROM tbl_jokes ORDER BY RAND() LIMIT ${count};`)
    return await query(`SELECT * FROM tbl_jokes WHERE type = ${types.map(x => (type == x.type)? x.id: null).filter(x => x != null)} ORDER BY RAND() LIMIT ${count};`)
}

export const addJoke = async (joke) => {
    var check = ''
    if (joke.type == '' || joke.type == undefined) check += 'Joke must contain a type! \n '
    if (joke.setup == '' || joke.setup == undefined) check += 'Joke must contain a setup! \n '
    if (joke.punchline == '' || joke.punchline == undefined) check += 'Joke must contain a punchline! \n '
    if (check != '') return check

    await query(`INSERT INTO tbl_jokes(type, setup, punchline) VALUES(${joke.type},\"${joke.setup}\",\"${joke.punchline}\")`)

    return ((await query(`SELECT * FROM tbl_jokes WHERE type=\"${joke.type}\" AND setup=\"${joke.setup}\" AND punchline=\"${joke.punchline}\"`)) != null)
}

export const getTypes = async () => await query(`SELECT * FROM tbl_type`)
