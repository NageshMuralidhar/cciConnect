const mongoose = require('mongoose')

var UserConnectionsSchema = mongoose.Schema({
    userId: String,
    conDet: Array
});

// get user profile
UserConnectionsSchema.statics.getUserProfile = function getUserProfile(loggedUser, cb) {
    return UserConnections.find({ userId: loggedUser }).exec(cb);
}

// add/update user connection chain
UserConnectionsSchema.statics.addCon = function addCon(logged_user, saveConnectionUser, cb) {
    return UserConnections.update({ userId: logged_user }, { $push: { conDet: saveConnectionUser } }).exec(cb);
}

// create a new connection chain
UserConnectionsSchema.statics.newCon = function newCon(userConToAdd, cb) {
    UserConnections.create(userConToAdd);
}

// delete a connection chain based off of the users ID
UserConnectionsSchema.statics.deleteSavedConnection = function deleteSavedConnection(logged_user, delete_array, cb) {
    return UserConnections.update({ $pullAll: { conDet: [delete_array] } }).exec(cb);
}

// export model
var UserConnections = mongoose.model('UserConnections', UserConnectionsSchema);
module.exports = UserConnections;