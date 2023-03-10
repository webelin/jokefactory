import mysql from 'mysql2'
import util from 'util'

const connection = mysql.createPool({
    host: '20.21.246.173',
    user: 'root',
    password: 'dissys1234',
    database: 'joke_norm',
    port: 33060,
    connectionLimit: 10
});


const mysqlQuery = util.promisify(connection.query).bind(connection)

export async function query(sql) {
    return await mysqlQuery(sql) 
} 