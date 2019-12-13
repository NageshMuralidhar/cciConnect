//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

//Author: Nagesh Bangalore Muralidhar

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// app pre requisites
var express = require("express");
var router = express.Router();
var app = express();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var session = require("express-session");
const { check, validationResult } = require('express-validator');

console.log('\n\n Prerequisites Engine Loading....\n\n')
console.log('\n\n Loading Complete....\n\n')

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// app preferences
app.set("view engine", "ejs");
app.use("/assets/", express.static("assets"));
router.use(session({ secret: "nbad is tough" }));
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
var encryptedString;
var decryptedString;
var loggedUser;

console.log('\n\n Assets Engine Loading....\n\n')
console.log('\n\n Loading Complete....\n\n')

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

//mondgoDB and mongoose driver
var Connections = require('../model/connections');
var Users = require('../model/User');
var UserConnections = require('../model/UserConnections');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cciDB');
var db = mongoose.connection;

console.log('\n\n Database Engine Loading....\n\n')
console.log('\n\n Loading Complete....\n\n')
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//


console.log('\n\n Controller Engine Loading....\n\n')
console.log('\n\n Loading Complete....\n\n')

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for home
//------------------------//
//Login page loading route//
//--return render route---//
//------------------------//

router.get("/", function (req, res) {
    msg = ""
    res.render("login.ejs", { msg: msg });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for index page
//------------------------//
//-Home page loading route//
//--return render route---//
//------------------------//
router.get("/index.ejs", function (req, res) {
    res.render("index.ejs", { username: req.session.loggedUser[0].firstName });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for home
//------------------------//
//-Home page loading route//
//--return render route---//
//------------------------//
router.get("/login.ejs", function (req, res) {
    req.session.destroy();
    msg = "You have been signed out, please sign in again";
    res.render("login.ejs", { qs: req.query, msg: msg });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// login route
//------------------------//
//Login page loading route//
//--return render route---//
//------------------------//
router.post("/login", [check('username').isEmail(), check('password').isLength({ min: 4 })], urlencodedParser, function (req, res) {
    loggedUser = req.body.email;
    // invalid username or password
    if (req.body.email == "" || req.body.password == "") {
        let msg = "Username or password is invalid";
        res.render("login.ejs", { msg: msg });
    }

    //validate user with given credentials
    else {
        Users.validateUser(req.body.email, function (err, userLoggedIn) {
            if (err) console.log(err)

            // decryption
            decryptedString = cryptr.decrypt(userLoggedIn[0].password);

            // valid details
            if (userLoggedIn.length > 0 && userLoggedIn[0].email === req.body.email && req.body.password === decryptedString) {
                let msg = '';
                req.session.loggedUser = userLoggedIn;
                res.render("index", { msg: msg, username: req.session.loggedUser[0].firstName });
            }

            // null array (no users details found)
            else if (userLoggedIn.length == 0) {
                let msg = "Username or password is invalid";
                res.render("login.ejs", { msg: msg });
            }

            // invalid credentials
            else if (userLoggedIn.length > 0 || userLoggedIn[0].email != req.body.email || req.body.password != decryptedString) {
                let msg = "Username or password is invalid";
                res.render("login.ejs", { msg: msg });
            }
        });

    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

//route for registering the user
//------------------------//
//-Signup page route------//
//--return render route---//
//------------------------//
router.get("/signUp.ejs", urlencodedParser, function (req, res) {
    let failText = '';
    let successText = '';
    res.render("signUp.ejs", { failText: failText, successText: successText });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

//router for registering user data
//------------------------//
//-Signup post route------//
//--return render route---//
//------------------------//
router.post("/signUp", [check('email').isEmail(), check('password').isLength({ min: 6 })], urlencodedParser, function (req, res) {
    var userRegister = req.body;
    // invalid password from express validator
    if (userRegister.password.length < 6) {
        let failText = 'Password should be atleast 6 characters';
        let successText = '';
        res.render("signUp.ejs", { failText: failText, successText: successText });
    }

    // empty fields
    else if (userRegister.firstName == '' || userRegister.lastName == '' || userRegister.email == '' || userRegister.password == '') {
        let failText = 'Please fill in all the fields';
        let successText = '';
        res.render("signUp.ejs", { failText: failText, successText: successText });
    }

    // encryption on client side
    else {
        encryptedString = cryptr.encrypt(userRegister.password);
        decryptedString = cryptr.decrypt(encryptedString);
        userRegister.password = encryptedString;

        // validate user if exists
        Users.validateUser(req.body.email, function (err, userLoggedIn) {
            if (userLoggedIn.length != 0) {
                res.send('User already exists')
            }
            // create new user
            else {
                Users.registerUser(userRegister, function (err, userRegisterData) {
                    if (err) console.log(err);
                });
                let successText = 'User Created';
                let failText = '';
                res.render("signUp.ejs", { failText: failText, successText: successText });
            }
        })
    }
})

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for savedConnections.ejs
//-----------------------------//
//-savedConnections route------//
//--return render route--------//
//-----------------------------//

let delete_flag = false;
router.get("/savedConnections.ejs", async function (req, res) {
    let updated_rsvp = req.query.rsvp;
    let logged_user = req.query.email;
    let saveConnectionUser = [[req_connection, updated_rsvp]];
    let connection_array = [];
    let userConToAdd = { userId: loggedUser, conDet: saveConnectionUser };
    let deletable_id = req.query.deletable_id;
    let delete_rsvp = req.query.delete_rsvp;

    // undefined rsvp control
    if (delete_rsvp == undefined) {
        delete_flag = false;
        UserConnections.getUserProfile(loggedUser, async function (err, UCD) {
            if (UCD === undefined || UCD.length == 0) {
                await UserConnections.newCon(userConToAdd, function (err, data) {
                    if (err) console.log(err)
                })
            }
            else {
                if (req.query.rsvp != undefined) {
                    await UserConnections.addCon(loggedUser, saveConnectionUser, function (err, data) {
                        if (err) console.log(err)
                    })
                }
            }
            await UserConnections.getUserProfile(loggedUser, function (err, UCD) {
                let connection_rsvp_table = {};
                for (values in UCD[0].conDet) {
                    connection_rsvp_table[UCD[0].conDet[values][0]] = UCD[0].conDet[values][1];
                    connection_array.push(UCD[0].conDet[values][0]);
                }
                Connections.getConnectionMultiple(connection_array, function (err, userSavedConnections) {
                    let updateCon = userSavedConnections;
                    for (con in updateCon) {
                        updateCon[con].rsvp = connection_rsvp_table[updateCon[con].cID]
                    }
                    res.render("savedConnections.ejs", { savedConnection: updateCon, username: req.session.loggedUser[0].firstName });
                });
            })
        })
    }

    // defined rsvp control
    if (delete_rsvp != undefined) {
        delete_flag = true;
        let delete_array = [];
        await UserConnections.getUserProfile(loggedUser, async function (err, UCD) {
            for (val in UCD[0].conDet) {
                if (UCD[0].conDet[val][0] == deletable_id) {
                    delete_array.push(UCD[0].conDet[val])
                }
            }
            for (entry in delete_array) {
                await UserConnections.deleteSavedConnection(loggedUser, delete_array[entry], function (err, deletable_id) {
                    if (err) console.log(err)
                });
            }
            await UserConnections.getUserProfile(loggedUser, async function (err, UCD) {
                let connection_rsvp_table = {};
                for (values in UCD[0].conDet) {
                    connection_rsvp_table[UCD[0].conDet[values][0]] = UCD[0].conDet[values][1];
                    connection_array.push(UCD[0].conDet[values][0]);
                }
                await Connections.getConnectionMultiple(connection_array, function (err, userSavedConnections) {
                    let updateCon = userSavedConnections;
                    for (con in updateCon) {
                        updateCon[con].rsvp = connection_rsvp_table[updateCon[con].cID]
                    }
                    res.render("savedConnections.ejs", { savedConnection: updateCon, username: req.session.loggedUser[0].firstName });
                });
            })
        });
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for connection.ejs
//-----------------------------//
//-------connection route------//
//--return render route--------//
//-----------------------------//
var req_connection;
router.get("/connection.ejs", function (req, res) {
    req_connection = req.query.cciconnection;
    Connections.getConnection(req_connection, function (err, connection) {
        res.render("connection.ejs", { connection: connection, username: req.session.loggedUser[0].firstName });
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for connections.ejs
var deleteCon;
router.get("/connections.ejs", urlencodedParser, function (req, res) {
    deleteCon = req.query.deleteCon;
    if (deleteCon != undefined) {
        deleteCon = deleteCon.toString();
        Connections.deleteConnection(deleteCon, function (err, deleteConnection) {
        })
    }
    Connections.getConnections(function (err, allConnections) {
        let author = req.session.loggedUser;
        if (allConnections.length == 0) {
            let empty = "../newConnection.ejs";
            res.render("connections.ejs", { author: author, empty: empty, connections: allConnections, username: req.session.loggedUser[0].firstName });
        }
        else {
            let empty = "";
            res.render("connections.ejs", { author: author, empty: empty, connections: allConnections, username: req.session.loggedUser[0].firstName });
        }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for contact
router.get("/contact.ejs", function (req, res) {
    res.render("contact.ejs", { username: req.session.loggedUser[0].firstName });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for about
router.get("/about.ejs", function (req, res) {
    res.render("about.ejs", { username: req.session.loggedUser[0].firstName });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for newConnection
var editConnection;
router.get("/newConnection.ejs", function (req, res) {
    editConnection = req.query.editCon;
    if (editConnection) {
        editConnection = editConnection.toString();
    }
    var caution = "";
    res.render("newConnection", { caution: caution, qs: req.query, username: req.session.loggedUser[0].firstName });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling after a successful connection creation
//-----------------------------//
//---newConnection route-------//
//--return render route--------//
//-----------------------------//
router.post("/newConnection", [check('cName').isLength({ min: 5 }), check('cTitle').isLength({ min: 5 }), check('chost').isLength({ min: 5 }), check('cdescription').isLength({ min: 5 }), check('clocation').isLength({ min: 5 }),], urlencodedParser, function (req, res) {
    let newConnection = req.body;
    let connection_id;

    // invalid fields
    if (newConnection.cName.length < 5 || newConnection.cTitle.length < 5 || newConnection.chost.length < 5 || newConnection.cdate.length < 5 || newConnection.ctime.length < 5 || newConnection.cdescription.length < 5 || newConnection.clocation.length < 5) {
        var caution = "Minimum of 5 characters are needed to describe any connection detail.";
        res.render("newConnection", { caution: caution, qs: req.query, username: req.session.loggedUser[0].firstName });
    }

    // valid fields
    else {
        if (editConnection != undefined) {
            Connections.getConnection(editConnection, function (err, singleCon) {
                singleCon = singleCon[0];
                newConnection.cID = editConnection;
                Connections.updateConnection(newConnection, editConnection, function (err, conData) {
                    if (err) console.log(err)
                });
            })
        }
        else {
            Connections.getConnections(function (err, conList) {
                connection_id = conList.length;
                newConnection.cID = connection_id + 1;
                newConnection.user_sync = req.session.loggedUser[0].email;
                editConnection = newConnection.cID;
                if (conList.length != 0) {
                    if (conList[0].cName == newConnection.cName && conList[0].cTitle == newConnection.cTitle && conList[0].user_sync == newConnection.user_sync) {
                        Connections.updateConnection(newConnection, editConnection, function (err, conData) {
                            if (err) console.log(err)
                        });
                    }
                    else {
                        Connections.addConnection(newConnection, function (err, conData) {
                            if (err) console.log(err)
                        });
                    }
                }
                else {
                    Connections.addConnection(newConnection, function (err, conData) {
                        if (err) console.log(err)
                    });
                }
            });
        }

        // successful render method
        var caution = "";
        res.render("newConnection", { caution: caution, qs: req.query, username: req.session.loggedUser[0].firstName });
    }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for easter eggs page
router.get("/seeDogs.ejs", function (req, res) {
    res.render("seeDogs", { qs: req.query, username: req.session.loggedUser[0].firstName });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// route handling for non matching url
router.get("/*", function (req, res) {
    res.render("404.ejs");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

module.exports = router;

//+++++++++++++++++++++++++++END of FILE+++++++++++++++++++++++++++++++++++++//