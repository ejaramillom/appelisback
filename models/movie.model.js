const mongoose = require ( "mongoose" );

const movieSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imdb: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model( "Movie", movieSchema )
