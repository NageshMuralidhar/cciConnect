// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('\nDatabase Test is connected\n')

    var kittySchema = new mongoose.Schema({
        name: String
    });

    kittySchema.methods.speak = function () {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    }

    var Kitten = mongoose.model('Kitten', kittySchema);
    var fluffy = new Kitten({ name: 'fluffy' });
    fluffy.speak(); // "Meow name is fluffy"


    var silence = new Kitten({ name: 'Silence' });
    console.log('\n' + silence.name + '\n'); // 'Silence'

    // saving the model to mongodb
    fluffy.save(function (err, fluffy) {
        if (err) return console.error(err);
        console.log('No error found')
        fluffy.speak();
    });

    // finding the documents in mongodb
    // Kitten.find(function (err, kittens) {
    //     if (err) return console.error(err);
    //     console.log(kittens);
    // })

    Kitten.find({ name: /^fluff/ }, function (err, kittens) {
        if (err) return console.log(err)
        console.log(kittens)
    });

    // finding a kitten
})






// fluffy.save(function (err, fluffy) {
//     if (err) return console.error(err);
//     fluffy.speak();
// });

// Kitten.find(function (err, kittens) {
//     if (err) return console.error(err);
//     console.log(kittens);
// })

// Kitten.find({ name: /^fluff/ }, callback);