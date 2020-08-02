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
userSchema.pre( "save", function (next) {
  bcrypt.hash( this.password, 10, ( err, hash ) => {
    if ( err ){
      return next( err );
    }
    this.password = hash;
    next();
  });
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

//export the model
module.exports = mongoose.model( "User", userSchema );
