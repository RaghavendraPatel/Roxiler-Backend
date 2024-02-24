const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

const pool = require('./config/postgresql');

pool.on('connect', () => {
    console.log('connected to the db');
});

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/',require('./routes'))

app.listen(port, (error) => {
    if (error) {
        console.log(`Error: ${error}`);
        return;
    }
    console.log(`Server is running on port ${port}`);
});
