const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const cardSchema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  board: { type: String, required: true },
  author: { type: String, required: true },
});

module.exports = moongoose.model('Card', cardSchema);
