const express = require('express');
const bodyParser = require('body-parser');

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');


const app = express();
app.use(bodyParser.urlencoded({ extended: true })); //Add Middleware
app.use(bodyParser.json()); //Add Middleware

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {useNewUrlParser: true})
    .then(() => {
        console.log("Successfully connected to the database");    
        })
    .catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to MyNotes application. Organize and track of all your notes."});
});

require('./routes/note.routes.js')(app);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});