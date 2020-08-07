const mongoose = require ( "mongoose" );
const bcrypt = require ( "bcrypt" );

//define the schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "is required"]
  },
  email: {
    type: String,
    required: [true, "is required"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "is required"]
  }
});

//hash the password
userSchema.pre( 'save', function( next ) {
  // Check if document is new or a new password has been set
  if ( this.isNew || this.isModified( "password" )) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash( document.password, 10,
      function( err, hashedPassword ) {
      if ( err ) {
        next( err );
      }
      else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

//authenticate the user with bcrypt
userSchema.statics.authenticate = async( email, password ) => {
  const user = await mongoose.model( "User" ).findOne({ email: email });
  if ( user ) {
    return new Promise(( resolve, reject ) => {
      bcrypt.compare( password, user.password, ( err, result ) => {
        if ( err ) reject( err );
        resolve( result === true ? user : null );
      });
    });
    return user;
  }
  return null;
};

//checks in database if user password is right
userSchema.methods.isCorrectPassword = function( password, callback ){
  bcrypt.compare( password, this.password, function( err, same ) {
    if ( err ) {
      callback( err );
    } else {
      callback( err, same );
    }
  });
}

//export the model
module.exports = mongoose.model( "User", userSchema );
