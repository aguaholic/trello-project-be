const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');
// const { cardSchema } = require('./card');

const Schema = moongoose.Schema;

const boardSchema = new Schema({
  name: { type: String, required: true },
  // cards: [{ type: [cardSchema], required: false }],
  cards: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Board' }],
  author: { type: String, required: true },
});

module.exports = moongoose.model('Board', boardSchema);
