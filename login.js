const express = require('express')
var bodyParser = require('body-parser')
const axios = require("axios");
const mysql = require('mysql2')

const app = express()
const port = 5001

const SERVICE_NAME = "Login";

// Endpoints
const MONITORING_URL = "http://monitoring:5005/log";
const GET_FAV_URL = "http://favorites:5002/favorites/";

var promisePool;

var jsonParser = bodyParser.json()

app.post('/login', jsonParser, async function (req, res) {
    
     postAsyncLog("Endpoint login called")

    console.log("Username: " + req.body.username);
    console.log("Password: " + req.body.password);

    const [result, fields] = await promisePool.query(`SELECT guid, user FROM login where user = '${req.body.username}' and password = '${req.body.password}'`)
    postAsyncLog(`Results fetched: ${result}`)

    const favDetails = await fetchFavForGuid(result[0].guid);

    const respondeJson = {
        'userDetails': result,
        'favDetails': favDetails.data.favDetails
    }
    
    res.send(result);
})

app.get('/', (req, res) => res.send('It works!'))

// Define http Method For generic use
const postAsyncLog = async message => {
    try {
        params = {
            service: SERVICE_NAME,
            timestamp: Date.now(),
            message: message,
        }

        const response = await axios.post(MONITORING_URL, params);
        if (response.status == 200) {
            console.log("Successfully sent to monitoring");
        }
    } catch (error) {
        console.log(error);
    }
};

const fetchFavForGuid = async guid => {
    try {
        const response = await axios.get(GET_FAV_URL + guid);
        return response;
    } catch (error) {
        console.log(error);
    }
};

// Start server and establish connection to db
app.listen(port, () => {

    console.log(`Example app listening at http://localhost:${port}`)
    console.log(`Establish connection to db...`)

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