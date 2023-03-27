const express = require('express');
const { check, validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Card = require('../models/card');
const router = express.Router();

router.get('/', async (req, res, next ) => {
  let cards;

  try {
    cards = await Card.find(cards);
  } catch (err) {
    const error = new HttpError('Couldn\'t find cards, please try again.', 500);
    return next(error);
  }
  res.json({ cards })
});

router.get('/:id', async (req, res, next ) => {
  const cardId = req.params.id;
  let card;

  try {
    card = await Card.findById(cardId);
  } catch (err) {
    const error = new HttpError('Couldn\'t find card, please try again.', 500);
    return next(error);
  }
  
  if(!card) next(new HttpError('Could not find card with provided id.', 404));

  res.json({ card: card.toObject({ getters: true }) });
});

router.post('/', [
  check('title').notEmpty(),
  check('subject').isLength({ min: 5 }),
  check('board').notEmpty(),
  check('author').notEmpty(),
  ], async (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return next(new HttpError('Invalid input, check you data.', 422));
  }
  
  const { title, subject, board, author } = req.body;
  
  const createdCard = new Card({
    title,
    subject,
    board,
    author,
  });

  try {
    await createdCard.save();
  } catch (err) {
    const error = new HttpError('Couldn\'t create a card, please try again.', 500);
    return next(error);
  }

  res
    .status(201)
    .json({ card: createdCard });
});

router.patch('/:id', [
  check('title').notEmpty(),
  check('subject').isLength({ min: 5 }),
  check('board').notEmpty(),
  ], async (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return next(new HttpError('Invalid input, check you data.', 422));
  }

  const { title, subject, board } = req.body;
  const cardId = req.params.id;

  let card;

  try {
    card = await Card.findById(cardId);
  } catch (err) {
    const error = new HttpError('Couldn\'t update card, please try again.', 500);
    return next(error);
  }

  card.title = title;
  card.subject = subject;
  card.board = board;

  try {
    await card.save();
  } catch (err) {
    const error = new HttpError('Couldn\'t save card, please try again.', 500);
    return next(error);
  }
  
  res
    .status(200)
    .json({ card: card.toObject({ getters: true }) });
  });

router.delete('/:id', async (req, res, next) => {
  const cardId = req.params.id;

  let card;

  try {
    card = await Card.findById(cardId);
  } catch (err) {
    const error = new HttpError('Couldn\'t delete card, please try again.', 500);
    return next(error);
  }

  try {
    await card.deleteOne();
  } catch (err) {
    const error = new HttpError('Couldn\'t delete card, please try again.', 500);
    return next(error);
  }

  res
  .status(200)
  .json({ message: `Board with id ${cardId} was deleted.` })
});

module.exports = router;
