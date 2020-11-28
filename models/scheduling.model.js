const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    cidName: {
        type: String,
        ref: 'CID'
    },
    ubsName: {
        type: String,
        ref: 'USB'
    },
    schedulingTime: {
        type: String,
        ref: 'Scheduling Time',
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],
    schedulingType: {
        type: String,
        required: true
    },
    other: {
        type: String
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
