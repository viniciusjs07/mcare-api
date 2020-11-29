const Patient      = require('../models/patient.model');
const Schedules    = require('../models/scheduling.model');
const Professional = require('../models/professional.model');
const Service      = require('../models/service.model'); 

exports.patient_get_history = async(req, res, callback) => {
    
    let patient = await Patient.find({name: req.params.patient_name}, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({error: 'Erro ao localizar paciente ' + err.message});
        }
    });


    let patientSchedules = await Schedules.find({patient: patient[0]._id, status: 'Atendido'}, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({error: 'Erro ao localizar atendimentos ' +  err.message});
        }
    }).populate('professional services');



    return res.status(200).send({patientSchedules});
};

exports.patient_get_all = async(req, res, callback) => {
  const patients = await Patient.find({}, (err) => {
      if(err){
          console.error(err);
          return res.status(400).send({error: err.message});
      }
  }).select('_id name gender birthdate phone');

  return res.status(200).send({patients});
};

exports.patient_get_by_company = async(req, res, callback) => {
    const patients = await Patient.aggregate([
        {
            $group: {
                _id: "$company",
                total: { $sum: 1 }
            }
        }
    ] , (err) => {
        if(err){
            console.error(err);
            return res.status(400).send({error: err.message});
        }
    });

    const companies = [];
    const patients_by_companies = [];
    for (let i = 0; i < patients.length; i++) {
        companies[i] = patients[i]._id;
        patients_by_companies[i] = patients[i].total;
    }
    return res.status(200).send({companies: companies, patients_by_companies: patients_by_companies});
};

exports.patient_create = (req, res, callback) => {
    let patient = new Patient({
        name: req.body.name,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        city: req.body.city,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        country: req.body.country,
        cep: req.body.cep,
        otherInfo: req.body.otherInfo,
        allergy: req.body.allergy,
        userMedicine: req.body.userMedicine,
        medicineDescription: req.body.medicineDescription,
        diabetic: req.body.diabetic,
        hypertensive: req.body.hypertensive,
        heartDisease: req.body.heartDisease,
        pneumonia: req.body.pneumonia,
        asthma: req.body.asthma,
        hyperthyroidism: req.body.hyperthyroidism,
        smoking: req.body.smoking,
        alcoholism: req.body.alcoholism,
        company: req.body.company,
    });

    if(req.body.userMedicine === 'Sim') {
        patient.medicineDescription = req.body.medicineDescription;
    }

    patient.save( (err) =>  {
        if(err) {
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else{
            console.log('Paciente cadastrado com sucesso');
            res.status(200).send({message: 'Paciente cadastrado com sucesso'});
        }
    });
};

exports.patient_detail = async (req, res, callback) => {
    const patient = await Patient.find({name: req.params.patient_name}, (err) => {
        if (err) {
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } 
    });

    if(patient !== null && patient !== undefined && patient.length > 0) {
        return res.status(200).send({patient: patient[0]});
    } else {
        return res.status(404).send({message: 'Paciente não encontrado.'});
    }
};

exports.patient_update = (req, res, callback) => {
    Patient.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, patient) => {
        if (err) {
            console.error(err);
            res.status(400).send({erro: err.message});
            return callback(err);
        } else {
            console.log('Paciente atualizado.');
            res.status(200).send({message: 'Paciente atualizado.'});
        }
    });
};

exports.patient_delete = (req, res, callback) => {
    Patient.deleteOne({name: req.params.patient_name}, (err) => {
        if (err){
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else {
            console.log('Paciente Removido');
            res.status(200).send({message: 'Paciente removido.'});
        }
    })
};
