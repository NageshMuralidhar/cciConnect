const mongoose = require('mongoose');

var connectionsSchema = mongoose.Schema({
  cID: String,
  cName: String,
  cTitle: String,
  chost: String,
  cdate: String,
  ctime: String,
  cdescription: String,
  clocation: String,
  user_sync: String
});

// get all connections
connectionsSchema.statics.getConnections = function getConnections(cb) {
  return Connections.find({}).exec(cb)
}

// get a single connection based on its ID
connectionsSchema.statics.getConnection = function getConnection(connectionID, cb) {
  return Connections.find({ cID: connectionID }).exec(cb)
}

// get multiple connections matching an array of ID's
connectionsSchema.statics.getConnectionMultiple = function getConnectionMultiple(connection_array, cb) {
  return Connections.find({ cID: { $in: connection_array } }).exec(cb)
}

// update/add new connection
connectionsSchema.statics.addConnection = function addConnection(newConnection, cb) {
  Connections.create(newConnection);
}

// update existing connection
connectionsSchema.statics.updateConnection = function updateConnection(newConnection, editConnection, cb) {
  return Connections.update({ cID: editConnection }, newConnection).exec(cb)
}

// delete connection
connectionsSchema.statics.deleteConnection = function deleteConnection(deleteConnection, editConnection, cb) {
  return Connections.deleteOne({ cID: deleteConnection }).exec(cb)
}



// Export the model
var Connections = mongoose.model('Connections', connectionsSchema);
module.exports = Connections;