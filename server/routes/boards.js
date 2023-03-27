const express = require('express');
const { check, validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Board = require('../models/board');

const router = express.Router();

router.get('/', async (req, res, next ) => {
  let boards;

  try {
    boards = await Board.find(boards);
  } catch (err) {
    const error = new HttpError('Couldn\'t find boards, please try again.', 500);
    return next(error);
  }
  res.json({ boards })
});

router.get('/:id', async (req, res, next ) => {
  const boardId = req.params.id;
  let board;

  try {
    board = await Board.findById(boardId);
  } catch (err) {
    const error = new HttpError('Couldn\'t find board, please try again.', 500);
    return next(error);
  }

  if(!board) next(new HttpError('Could not find board with provided id.', 404));

  res.json({ board: board.toObject({ getters: true }) });
});

router.post('/', [
  check('name').notEmpty(),
  check('author').notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return next(new HttpError('Invalid input, check you data.', 422))
  }

  const { name, author } = req.body;
  // const { name, cards, author } = req.body;
  
  const createdBoard = new Board({
    name,
    cards: [],
    author,
  });

  try {
    await createdBoard.save();
  } catch (err) {
    const error = new HttpError('Couldn\'t create a board, please try again.', 500);
    return next(error);  }
  
  res
  .status(201)
  .json({ board: createdBoard });
});

router.patch('/:id', [
  check('name').notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return next(new HttpError('Invalid input, check you data.', 422));
  }

  const { name, cards } = req.body;
  const boardId = req.params.id;

  let board;
  
  try {
    board = await Board.findById(boardId);
  } catch (err) {
    const error = new HttpError('Couldn\'t update board, please try again.', 500);
    return next(error);
  }

  board.name = name;
  board.cards = cards;

  try {
    await board.save();
  } catch (err) {
    const error = new HttpError('Couldn\'t save board, please try again.', 500);
    return next(error);
  }
  
  res
  .status(200)
  .json({ board: board.toObject({ getters: true }) });
});

router.delete('/:id', async (req, res, next) => {
  const boardId = req.params.id;

  let board;

  try {
    board = await Board.findById(boardId);
  } catch (err) {
    const error = new HttpError('Couldn\'t delete board, please try again.', 500);
    return next(error);
  }

  try {
    await board.deleteOne();
  } catch (err) {
    const error = new HttpError('Couldn\'t delete board, please try again.', 500);
    return next(error);
  }

  res
  .status(200)
  .json({ message: `Board with id ${boardId} was deleted.` })
});

module.exports = router;
