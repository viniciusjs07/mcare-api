const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let SchedulingSchema = new Schema({
    date: {
        type: String,
        required: true   
    },
    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    professional: {
        type: mongoose.Types.ObjectId,
        ref: 'Professional',
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],
    discount: {
        type: Number,
        require: true
    },
    schedulingType: {
        type: String,
        required: true
    },
    other: {
        type: String
    },
    finalPrice: {
        type: Number,
        required: true
    },
    paymentMethdod: {
        type: String,
        required: true
    },
    payInCard: {
        type: Number,
        require: false
    },
    payInCash: {
        type: Number,
        required: false
    },
    paymentMade: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Aguardando'
    },
    bloodPressure: {
        type: String,
        default: 'Não Informado'
    },
    heartFrequency: {
        type: String,
        default: 'Não Informado'
    },
    breathFrequency: {
        type: String,
        default: 'Não Informado'
    },
    temperature: {
        type: String,
        default: 'Não Informado'
    },
    pain: {
        type: String,
        default: 'Não Informado'
    },
    localPain: {
        type: String,
        default: 'Não Informado'
    },
    weight: {
        type: String,
        default: 'Não Informado'
    },
    height: {
        type: String,
        default: 'Não Informado'
    },
    clinicalStory: {
        type: String,
        required: false
    },
    priorityQueue: {
        type: String,
        default: 'Não informado'
    }
});

module.exports = mongoose.model('Scheduling', SchedulingSchema);