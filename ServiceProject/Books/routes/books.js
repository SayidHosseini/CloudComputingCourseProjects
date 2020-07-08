const express = require('express');
const router = express.Router();
const _ = require('underscore');

const Book = require('../model/books');
const { reduce } = require('underscore');

router.post('/', (req, res, next) => {
  const { title, author, publication, edition, publish_date } = req.body;
  
  if(!title || !author || !publication) {
    return res.status(400).json({ msg: "Fields title, author, publication are required!" });
  }

  book = new Book({ title, author, publication, edition, publish_date });
  Book.createOrUpdate(book, (err, rec) => {
    if(err && err.code === 11000) { // Duplicate Error - Title Unique
      return res.status(400).json({ msg: "Book exists!" });
    }
    if(err || !rec) {
      return next(err);
    }

    return res.status(201).json({ msg: "Book Created!" });
  });
});

router.get('/:title', (req, res, next) => {
  const { title } = req.params;

  Book.select(title, (err, rec) => {
    if(err) {
      return next(err);
    }
    if(!rec) {
      return res.status(404).json({ msg: "Book Not Found!" });
    }

    return res.status(200).json({ msg: "Found!", 
      details: _.pick(rec, ['title', 'author', 'publication', 'edition', 'publish_date']) });
  });
});

router.put('/:title', (req, res, next) => {
  const queryTitle = req.params.title;
  const { title, author, publication, edition, publish_date } = req.body;

  if(!title && !author && !publication && !edition && !publish_date) {
    return res.status(400).json({ msg: "You need to send some parameter to update!" });
  }

  Book.select(queryTitle, (err, rec) => {
    if(err) {
      return next(err);
    }
    if(!rec) {
      return res.status(404).json({ msg: "Book Not Found!" });
    }

    rec.title = title || rec.title;
    rec.author = author || rec.author;
    rec.publication = publication || rec.publication;
    rec.edition = edition || rec.edition;
    rec.publish_date = publish_date || rec.publish_date;

    Book.createOrUpdate(rec, (err, rec) => {
      if(err || !rec) {
        return next(err);
      }

      return res.status(200).json({ msg: "Book updated!" });
    });
  });
});

router.delete('/:title', (req, res, next) => {
  const { title } = req.params;

  Book.delete(title, (err, rec) => {
    if(err) {
      return next(err);
    }
    if(!rec.deletedCount) {
      return res.status(404).json({ msg: "Book not found!" });
    }

    return res.status(202).json({ msg: "Deleted the book!" });
  });
});

module.exports = router;
