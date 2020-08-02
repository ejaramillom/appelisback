const express = require( "express" );
const router = express.Router();
const jwt = require( "jsonwebtoken" );
const User = require( "./models/user.model" );
const Movie = require( "./models/movie.model" );
const axios = require( "axios" );
const cookieParser = require( "cookie-parser" );
const withAuth = require( "./middleware/auth" )

router.use( withAuth );

router.get( "/checkToken", withAuth, ( req, res ) => {
  res.sendStatus( 200 );
  console.log( "Token is valid!" )
});

router.get( "/", async ( req, res, next ) => {
  return res.redirect( "/topMovies" );
});

router.get( "/topMovies", async ( req, res, next ) => {

  axios.get( "https://api.themoviedb.org/3/movie/top_rated?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const topMovies = response.data.results;
      console.log( topMovies );
      return res.json( topMovies );
    })
    .catch( error =>{
      console.log( error );
    })
});

router.get( "/popularMovies", async ( req, res, next ) => {

  axios.get( "https://api.themoviedb.org/3/movie/popular_rated?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const popularMovies = response.data.results;
      console.log( popularMovies );
      return res.json( popularMovies );
    })
    .catch( error =>{
      console.log( error );
    })
});

router.get( "/playingMovies", async ( req, res, next ) => {

  axios.get( "https://api.themoviedb.org/3/movie/now_playing?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const playingMovies = response.data.results;
      console.log( playingMovies );
      return res.json( playingMovies );
    })
    .catch( error =>{
      console.log( error );
    })
});

router.get( "/newMovies", async ( req, res, next ) => {

  axios.get( "https://api.themoviedb.org/3/movie/upcoming?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const newMovies = response.data.results;
      console.log( newMovies );
      return res.json( newMovies );
    })
    .catch( error =>{
      console.log( error );
    })
});

router.get( "/favoriteMovies", withAuth, ( req, res, next ) => {

  axios.get( "https://api.themoviedb.org/3/movie/upcoming?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const favoriteMovies = response.data.results;
      console.log( favoriteMovies );
      return res.json( favoriteMovies );
    })
    .catch( error =>{
      console.log( error );
    })
});

router.get( "/register", ( req, res ) => {
  res.send( "You are in register backend" );
});

router.post( "/register", async ( req, res, next ) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password

  const data = {
    name: name,
    email: email,
    password: password
  };

  try {
    const user = await User.create( data );
    res.status( 200 ).send( "Welcome to the club!" );
  } catch ( e ) {
    console.error( e );
    res.status( 500 ).send( "Error registering user! Try again." );
  }
});

router.post( "/authenticate", async ( req, res, next ) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne( { email } );
    res.status( 200 ).send( "User exists in the database!" );
  } catch ( e ) {
    if ( e ) {
      console.error( e );
      res.status( 500 ).json({ error: "Internal error please try again" });
    } else if ( !user ) {
      res.status( 401 ).json({ error: "Incorrect email or password" });
    } else {
      user.isCorrectPassword( password, function( e, same ) {
        if ( e ) {
          res.status( 500 ).json({ error: "Internal error please try again" });
        } else if ( !same ) {
          res.status( 401 ).json({ error: "Incorrect email or password" });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign( payload, secret, {
            expiresIn: "1h"
          });
          res.cookie( "token", token, { httpOnly: true }).sendStatus( 200 );
        }
      });
    }
  }
});

router.get( "/login", ( req, res ) => {
  res.send( "You are in login backend" );
});

router.post( "/login", async ( req, res, next ) => {
  res.send( "You posted login backend" );
});

router.get( "/login", ( req, res ) => {
  res.redirect( "/" );
});

module.exports = router;
