const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const cardsRoutes = require('./routes/cards');
const boardsRoutes = require('./routes/boards');
const HttpError = require('./models/http-error');

const app = express();
const port = 5001;

app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept , Authorization'
//   );
//   res.setHeader('Access-Control-Allow-Methods',  'DELETE, POST, GET, OPTIONS');

//   next();
// });

app.use('/api/boards', boardsRoutes);

app.use('/api/cards', cardsRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find the requested route.', 404);
  throw error;
});

// middleware that only executes if a request has an error attached to it
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
  .status(error.code || 500)
  .json({ message: error.message || 'An unkown error ocurred.' });
});

mongoose
  .connect(`mongodb+srv://trellouser:${process.env.MONGO_ACCESS}@trelloclonecluster.dyb81mx.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`)))
  .catch(err => console.log(err));

// {
//   "title": "Ticket 4",
//   "subject": "Lorem 4 ipsum bloep lorem 4 ipsum bloep lorem 4 ipsum bloep",
//   "board": "doing",
//   "author": "Bloop Terra"
// }

// {
//   "name" : "Joyce",
//   "cards": [],
//   "author": "Maki"
// }