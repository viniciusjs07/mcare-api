const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const baseOptions = {
    discriminatorKey: '_type',
    collection: 'users'
};

let UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        max: 100
    },
    role: {
        type: String,
        required: true,
        max: 100
    },
    cpf: {
        type: String,
        required: true,
        max: 22,
        min: 6
    },
    rg: {
        type: String,
        required: true,
        max: 22,
        min: 6
    },
    address: {
        type: String,
        required: true,
        max: 2000
    },
    city: {
        type: String,
        required: true,
        max: 100
    },
    country: {
        type: String,
        max: 100
    },
    cep: {
        type: String,
        max: 50
    },
    email: {
        type: String,
        max: 50
    },
    phone: {
        type: String,
        required: true,
        max: 25
    },
    maritalStatus: {
        type: String,
        required: true,
        max: 100
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, baseOptions);

module.exports = mongoose.model('User', UserSchema);