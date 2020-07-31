const express = require ( "express" );
const cookieSession = require ( "cookie-session" );
const mongoose = require ( "mongoose" );
const routes = require( "./routes" );

//conexion
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost:27017/appelis",  { useNewUrlParser: true });
mongoose.set( "useFindAndModify", false );

const app = express();

app.use( cookieSession({
  secret: "gumball",
  maxAge: 24 * 60 * 60 * 1000
}));
app.use( express.urlencoded({ extended: true }));
app.use( "/", routes);

app.listen( 5000, () => console.log( "Listening on port 5000..." ))
