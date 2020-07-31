const express = require( "express" );
const router = express.Router();
const User = require( "./models/user.model" );
const Movie = require( "./models/movie.model" );
const axios = require ( "axios" );

router.get( '/', async ( req, res, next ) => {
  req.session.views = ( req.session.views || 0 ) + 1;

  axios.get( "https://api.themoviedb.org/3/movie/top_rated?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const topMovies = response.data.results;
      console.log( topMovies );
      res.json( topMovies );
    })
    .catch( error =>{
      console.log( error );
    })

});

module.exports = router;
