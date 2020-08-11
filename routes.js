const express = require( "express" );
const router = express.Router();
const jwt = require( "jsonwebtoken" );
const User = require( "./models/user.model" );
const Movie = require( "./models/movie.model" );
const axios = require( "axios" );
const cookieParser = require( "cookie-parser" );
const withAuth = require( "./middleware/auth" )

router.get( "/checkToken", withAuth, ( req, res ) => {
  res.sendStatus( 200 );
  console.log( "Token is valid!" );
});

router.get( "/", async ( req, res, next ) => {
  try {
    res.redirect( "/topMovies" );
    console.log( "succesfully fetched" );
  } catch ( err ) {
    console.log( err );
    next( err );
  }
});

router.get( "/topMovies", async ( req, res, next ) => {
  axios.get( "https://api.themoviedb.org/3/movie/top_rated?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const topMovies = response.data.results;
      console.log( "topMovies succesfully fetched" );
      return res.json( topMovies );
    })
    .catch( err => {
      console.log( err );
    })
});

router.get( "/popularMovies", async ( req, res, next ) => {
  axios.get( "https://api.themoviedb.org/3/movie/popular?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const popularMovies = response.data.results;
      console.log( "popular movies succesfully fetched" );
      return res.json( popularMovies );
    })
    .catch( err =>{
      console.log( err );
    })
});

router.get( "/playingMovies", async ( req, res, next ) => {
  axios.get( "https://api.themoviedb.org/3/movie/now_playing?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const playingMovies = response.data.results;
      console.log( "movies now playing succesfully fetched" );
      return res.json( playingMovies );
    })
    .catch( err =>{
      console.log( err );
    })
});

router.get( "/newMovies", async ( req, res, next ) => {
  axios.get( "https://api.themoviedb.org/3/movie/upcoming?api_key=8b01318939795027b44c93d6cfb76940&language=en-US&page=1" )
    .then( response => {
      const newMovies = response.data.results;
      console.log( "new movies succesfully fetched" );
      return res.json( newMovies );
    })
    .catch( error => {
      console.log( error );
    })
});

router.get( "/favoriteMovies", withAuth,  async ( req, res, next ) => {
  try {
    const favoriteMovies = await Movie.find().populate( "User" );
    return res.json( favoriteMovies );
    console.log( "succesfully fetched favorite movies!" );
  } catch ( err ) {
    console.log( err );
    next( err );
  }
});

router.post( "/register", async ( req, res, next ) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    name: name,
    email: email,
    password: password
  };

  try {
    const user = await User.create( data );
    res.status( 200 ).send( "Welcome to the club!" );
    alert( "User succesfully registered!" );
    console.log( "user succesfully registered!");
  } catch ( err ) {
    if ( User.findOne({ email }) ) {
      console.error( err );
      res.status( 400 ).send( "User already in database!." );
    } else {
      console.error( err );
      res.status( 500 ).send( "Error registering user! Try again." );
    }
  }
});

router.post( "/authenticate", async ( req, res, next ) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }, ( err, user ) => {
    if ( err ) {
      console.error( err );
      res.status( 500 ).json({ error: "Internal error please try again" });
    } else if ( !user ) {
      console.log( "incorrect password or email" );
      res.status( 401 ).json({ error: "Incorrect email or password" });
    } else {
      user.isCorrectPassword( password, ( err, same ) => {
        if ( err ) {
          console.log( "Internal error" );
          res.status( 500 ).json({ error: "Internal error please try again" });
        } else if ( !same ) {
          console.log( "incorrect password or email" );
          res.status( 401 ).json({ error: "Incorrect email or password" });
        } else {
          // Issue token
          console.log( "Satisfactory token!" );
          const payload = { email };
          const token = jwt.sign( payload, "secretcode", {
            expiresIn: "1h"
          });
          res.cookie( "token", token, { httpOnly: true }).sendStatus( 200 );
        }
      });
    }
  });
});

router.get( "/users", withAuth, async ( req, res, next ) => {
  try {
    const users = await User.find();
    return res.send( users );
  } catch ( err ) {
    console.log( err );
    next( err );
  }
});

router.post( "/add", withAuth, async ( req, res, next ) => {

  const data = {
		title: req.body.title,
		popularity: req.body.popularity,
    poster_path: req.body.poster_path,
    overview: req.body.overview,
		user: req.body.user
  }

	try {
		const already_movie = await Movie.findOne({ title: req.body.title })
		if( already_movie === null ) {
			const movie = new Movie( data );
			await movie.save();
      res.status( 200 ).send( "Movie added to your wishlist!" );
      console.log( "Movie added to favorites!" );
		} else {
      res.status( 400 ).send( "Movie already in favorite list!" );
		}
	} catch ( err ){
    console.log( err );
		res.status( 400 ).json( err );
	}

});

router.post( "/delete", async ( req, res, next ) => {

  try {
    const users = await User.find();
    return res.send( users );
  } catch (e) {
    console.log( e );
    next(e);
  }

});

module.exports = router;
