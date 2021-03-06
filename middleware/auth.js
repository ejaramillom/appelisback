const jwt = require( "jsonwebtoken" );
const User = require( "../models/user.model" );

withAuth = async ( req, res, next ) => {
  const token = req.cookies.token;

  if ( !token ) {
  res.status( 401 ).send( "Unauthorized: No token provided" );
  console.log( "no token provided" );
  } else {
    jwt.verify( token, "secretcode", ( err, decoded ) => {
      if (err) {
        res.status( 401 ).send( "Unauthorized: Invalid token" );
        console.log( "invalid token" );
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}

module.exports = withAuth ;
