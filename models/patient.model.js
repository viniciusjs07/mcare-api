const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
let PatientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        max: 100
    },
    gender: {
        type: String,
        required: true,
        max: 10
    },
    birthdate: {
        type: String,
        required: true,
        max: 10
    },
    city: {
        type: String,
        required: true,
        max: 100
    },
    address: {
        type: String,
        required: true,
        max: 2000
    },
    cep: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true,
        max: 22
    },
    email: {
        type: String,
        required: false,
        default: ''
    },
    company: {
        type: String,
        required: true,
        max: 200
    },
    country: {
        type: String, 
        default: 'Brasil'
    },
    otherInfo: {
        type: String,
        required: false
    },
    allergy: {
        type: String,
        required: true,
    },
    userMedicine: {
        type: String,
        required: true
    },
    medicineDescription: {
        type: String,
        default: ''
    },
    diabetic: {
        type: String,
        required: true
    },
    hypertensive: {
        type: String,
        required: true
    },
    heartDisease: {
        type: String,
        required: true
    },
    pneumonia: {
        type: String,
        required: true
    },
    asthma: {
        type: String,
        required: true
    },
    hyperthyroidism: {
        type: String,
        required: true
    },
    smoking: {
        type: String,
        required: true
    },
    alcoholism: {
        type: String,
        required: true
    },
    _type: {
        type: String,
        default: 'PATIENT'
    }
});

module.exports = mongoose.model('Patient', PatientSchema);
