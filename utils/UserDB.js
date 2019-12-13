var User = require("./../model/User.js");

var data = [{
    userId: 1,
    firstName: 'Nagesh',
    lastName: 'BM',
    email: 'email@email.com'
}, {
    userId: 2,
    firstName: 'Nagesh2',
    lastName: 'BM2',
    email: 'email2@email2.com'
}]
module.exports.getUsers = function () {
    let users = [];
    for (let i = 0; i < data.length; i++) {
        let user = new User(
            data[i].userId,
            data[i].firstName,
            data[i].lastName,
            data[i].email);

        users.push(user);
    }
    return users;

}