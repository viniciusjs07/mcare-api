const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ServiceSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    identifier: {
        type: String,
        required: true,
        unique: true,
        max: 100
    },
    professional: {
        type: mongoose.Types.ObjectId,
        ref: 'Professional'
    },
    other: {
        type: String
    }
});

module.exports = mongoose.model('Service', ServiceSchema);
