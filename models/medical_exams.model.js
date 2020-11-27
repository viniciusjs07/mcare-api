const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let MedicalExamsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'O nome do exame precisa ser único'],
        max: 100
    },
    type: {
    	type: String,
    	default: 'Exame Complementar'
    }
});

module.exports = mongoose.model('MedicalExams', MedicalExamsSchema);