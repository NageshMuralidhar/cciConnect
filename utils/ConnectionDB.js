var Connection = require("./../model/modelConnections.js");
connection_data = [
  {
    cID: "0",
    cName: "ITCS 1213 - Working with NetBeans",
    cTitle: "Study Category",
    chost: "Norm Niner",
    cdate: "Thursday, August 29, 2019",
    ctime: "5:30 - 6:30 PM",
    cdescription: "I'm new to NetBeans and would be more than welcome to get a headstart on the same. Attendees will get free pizza!",
    clocation: "Woodward Hall, Room 207",
    rsvp: ''
  },
  {
    cID: "1",
    cName: "ITCS 1211 - Working with NodeJS",
    cTitle: "Study Category",
    chost: "Node Norm Niner",
    cdate: "Friday, August 30, 2019",
    ctime: "5:30 - 6:30 PM",
    cdescription: "I'm new to Node.js and would be more than welcome to get a headstart on the same. Attendees will get free pizza!",
    clocation: "Woodward Hall, Room 106",
    rsvp: ''
  },
  {
    cID: "2",
    cName: "ITCS 6167 - Working with Artificial Intelligence",
    cTitle: "Study Category",
    chost: "AI Norm Niner",
    cdate: "Saturday, August 29, 2019",
    ctime: "5:30 - 6:30 PM",
    cdescription: "I'm new to AI and would be more than welcome to get a headstart on the same. Attendees will get free pizza!",
    clocation: "Woodward Hall, Room 107",
    rsvp: ''
  },
  {
    cID: "3",
    cName: "Lets Play Cricket",
    cTitle: "Sports Category",
    chost: "Nagesh",
    cdate: "Friday, August 29, 2019",
    ctime: "5:30 - 6:30 PM",
    cdescription: "Beautiful Day to play",
    clocation: "Rec Field 1",
    rsvp: ''
  },
  {
    cID: "4",
    cName: "Football Anyone",
    cTitle: "Sports Category",
    chost: "Nagesh",
    cdate: "Saturday, August 30, 2019",
    ctime: "5:30 - 6:30 PM",
    cdescription: "Beautiful Day to play",
    clocation: "Rec Field 2",
    rsvp: ''
  },
  {
    cID: "5",
    cName: "BBQ party at my place?",
    cTitle: "Sports Category",
    chost: "Nagesh",
    cdate: "Sunday, August 31, 2019",
    ctime: "5:30 - 6:30 PM",
    cdescription: "Beautiful Day to eat",
    clocation: "UT drive",
    rsvp: ''
  }
]


let connections = [];
for (let i = 0; i < connection_data.length; i++) {
  let connectn = new Connection(
    connection_data[i].cID,
    connection_data[i].cName,
    connection_data[i].cTitle,
    connection_data[i].chost,
    connection_data[i].cdate,
    connection_data[i].ctime,
    connection_data[i].cdescription,
    connection_data[i].clocation
  )
  connections.push(connectn);
}
module.exports.getConnectionId = function (cID) {
  for (var i = 0; i < connections.length; i++) {
    if (cID === connections[i].cID) {
      return connections[i];
    }
  }
}

module.exports.connections = connections;
