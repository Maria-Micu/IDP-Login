const express = require('express')
var bodyParser = require('body-parser')
const mysql = require('mysql2')

const app = express()
const port = 5001

const SERVICE_NAME = "Login";

var promisePool;

var jsonParser = bodyParser.json()

app.post('/login', jsonParser, async function (req, res) {
    
    const [result, fields] = await promisePool.query(`SELECT guid, user FROM login where user = '${req.body.username}' and password = '${req.body.password}'`)

    res.send(result);
})

app.get('/', (req, res) => res.send('It works!'))

// Start server and establish connection to db
app.listen(port, () => {

    const pool = mysql.createPool({
        host: 'database',
        user: 'root',
        database: 'mycompanydb',
        password: 'admin',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // now get a Promise wrapped instance of that pool
    promisePool = pool.promise();
   
})