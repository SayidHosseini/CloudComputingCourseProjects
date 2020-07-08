const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const books = require('./routes/books');

mongoose.connect("mongodb://localhost:27017/books", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true 
});

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/v1/books', books);

module.exports = app;
