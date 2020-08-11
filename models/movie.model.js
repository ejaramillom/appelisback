const mongoose = require ( "mongoose" );

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  popularity: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model( "Movie", movieSchema )
