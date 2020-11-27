const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let HealthPlanSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'O nome do plano de saúde precisa ser único'],
        max: 100
    },
    discount: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('HealthPlan', HealthPlanSchema);