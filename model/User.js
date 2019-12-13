const mongoose = require('mongoose');
UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
})

// validate user credentials
UserSchema.statics.validateUser = function validateUser(email, cb) {
    return Users.find({ email: email }).exec(cb)
}

// register users
UserSchema.statics.registerUser = function registerUser(userRegister, cb) {
    Users.create(userRegister);
}

// find registered user credentials
UserSchema.statics.findRegisteredUser = function findRegisteredUser(loggedUser, cb) {
    return Users.find({ email: loggedUser }).exec(cb)
}

// Export the model
var Users = mongoose.model('Users', UserSchema);
module.exports = Users;