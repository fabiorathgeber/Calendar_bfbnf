import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pizzamaster7!',
    database: 'events'
})

async function get() {
    try {
        const [results, fields] = await connection.query('SELECT * FROM users')

        console.log(results)
        console.log(fields)
    }
    catch(err) {
        console.log(err)
    }
};

async function addUser() {
    try {
        const [results, fields] = await connection.query('INSERT INTO users (email, pass) VALUES ("aodjaowi@hi.com", "passworddddddd")')
    }
    catch(err) {
        console.log(err)
    }
}

addUser();

get();

connection.end();