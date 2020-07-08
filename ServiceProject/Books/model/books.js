const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    publication: {
        type: String,
        required: true
    },
    edition: String,
    publish_date: String
});

const Book = module.exports = mongoose.model('Book', bookSchema);

module.exports.createOrUpdate = (book, callback) => {
    book.save(callback);
};

module.exports.delete = (title, callback) => {
    const query = { title };
    Book.deleteOne(query, callback);
};

module.exports.select = (title, callback) => {
    const query = { title };
    Book.findOne(query, callback);
};
