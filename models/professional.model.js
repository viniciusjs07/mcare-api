const mongoose = require('mongoose');
const Schema   =  mongoose.Schema;
const user     = require('./users.model');

let Professional = user.discriminator('Professional', new Schema({
    expertise: {
        type: String,
        required: true,
        max: 200,
        min: 3
    }
}));

module.exports = mongoose.model('Professional');