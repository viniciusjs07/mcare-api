const mongoose = require('mongoose');
const Schema   =  mongoose.Schema;
const user     = require('./users.model');

let Employee = user.discriminator('Employee', new Schema({
    degree: {
        type: String,
        required: true,
        max: 100
    },
    gender: {
        type: String,
        required: true
    }
}));

module.exports = mongoose.model('Employee');
