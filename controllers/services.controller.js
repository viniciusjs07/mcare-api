const Professional = require('../models/professional.model');
const Patient      = require('../models/patient.model');
const Service      = require('../models/service.model');
const Scheduling   = require('../models/scheduling.model');
const User         = require('../models/users.model');

exports.scheduling_get_all = async (req, res, callback) => {

    const reqUser = await User.findById(req.userId);
    
    if(!reqUser) {
        return res.status(401).send({message: 'Desculpe, não conseguimos validar sua autenticação.'});
    }

    let schedules = [];

    if (reqUser._type === 'Professional') {
        schedules = await Scheduling.find({professional: reqUser._id}, (err) => {
            if(err){
                console.error(err);
                return res.status(400).send({error: err.message});
            }
        }).populate('services');
    } else {
        const professionalId = await Professional.find({name: req.params.professional_name}, (err) => {
            if (err) {
                console.error(err);
                return res.status(400).send({error: err.message});
            }
        });
        schedules = await Scheduling.find({professional: professionalId}, (err) => {
            if(err){
                console.error(err);
                return res.status(400).send({error: err.message});
            }
        }).populate('services');
    }

    result = []
    for(let i = 0 ; i < schedules.length ; i++) {

        //Populate professional
        const professional = await Professional.findById(schedules[i].professional, (err) => {
            if(err) {
                console.error(err);
                return res.status(500).send({message: 'Erro ao recuperar profissional.' + err.message});
            }
        });
        if(!professional) {
            return res.status(404).send({message: 'Profissional responsavel não encontrado'});
        }

        //Populate Patient
        let patient = await Patient.findById(schedules[i].patient, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: 'Erro aou recuperar paciente.' + err.message});
            }
        });
        if(!patient) {
            patient = {
                name: 'Paciente Removido do Sistema'
            }
        }

        let servicesNames = [];
        for (let s of schedules[i].services) {
            servicesNames.push(s.name);
        }
        
        result.push(
            {
                date: schedules[i].date,
                patient: patient.name,
                professional: professional.name,
                finalPrice: schedules[i].finalPrice,
                paymentMethdod: schedules[i].paymentMethdod,
                paymentMade: schedules[i].paymentMade,
                status: schedules[i].status,
                _id: schedules[i]._id,
                clinicalStory: schedules[i].clinicalStory,
                priorityQueue: schedules[i].priorityQueue,
                services: servicesNames
            }
        );
    }
    schedules = result;
    return res.status(200).send({schedules});
}

exports.service_scheduling_get_signals = async (req, res, callback) => {
    const schedule = await Scheduling.findById(req.params.id, (err) => {
        if(err) {
            console.log(err);
            return res.status(500).send({message: 'Erro ao buscar agendamento. ' +err['message']});
        }
    }).select('bloodPressure heartFrequency breathFrequency temperature pain localPain weight height');

    if(schedule === null || schedule === undefined || schedule.length < 1)
        return res.status(404).send({message: 'Agendamento não encontrado'});
    else return res.status(200).send(schedule);
}

exports.service_scheduling_update = async (req, res, callback) => {
    Scheduling.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, scheduling) => {
        if (err) {
            console.error(err);
            res.status(400).send({erro: err.message});
            return callback(err);
        } else {
            res.status(200).send({message: 'Agendamento atualizado.'});
        }
    });
}

exports.service_scheduling_details  = async (req, res, callback) => {
    const schedule = await Scheduling.findById(req.params.id, (err, schedule) => {
        if(err){
            console.log(err);
            res.status(400).send({error: err.message});
            return callback(err);
        }
    });

    if (schedule === null || schedule=== undefined) res.status(404).send({message: 'Agendamento não encontrado'});
    else {
        let patient = await Patient.findById(schedule.patient, (err) => {
            if(err) res.status(500).send({message: 'Erro ao buscar paciente. ' + err['message'] });
        });

        if (patient === null || patient === undefined || patient.length === 0) patient = {name : 'Paciente removido do sistema'};

        const professional = await Professional.findById(schedule.professional, (err) => {
            if(err) res.status(500).send({message: 'Erro ao buscar profissional.' + err['message'] });
        });

        if (professional === null || professional === undefined || professional.length === 0) professional.name = 'Profissional removido do sistema';

        return res.status(200).send({schedule, patient_name: patient.name, professional_name: professional.name});
    }
};

exports.service_scheduling = async (req, res, callback) => {
    
    const patient = await Patient.find({name: req.body.patient_name},
        (err) => {
            if (err) {
                console.error('Erro ao buscar paciente', err);
                return res.status(500).send('Erro ao buscar paciente', err.message);
            }
        }
    );

    if (patient === null || patient === undefined || patient.length < 1) {
        return res.status(404).send({message: 'Paciente não encontrado'});
    }

    const professional = await Professional.find({name: req.body.professional_name},
        (err) => {
            if (err) {
                console.error('Erro ao buscar profissional', err);
                return res.status(500).send('Erro ao buscar profissional', err.message);
            }
        }
    );

    if(professional === null || professional === undefined || professional.length < 1) {
        return res.status(404).send({message: 'Profissional não encontrado'});
    }

    const scheduling = new Scheduling({
        date: req.body.date,
        discount: req.body.discount,
        schedulingType: req.body.schedulingType,
        other: req.body.other,
        finalPrice: req.body.finalPrice,
        patient: patient[0]._id,
        professional: professional[0]._id,
        services: req.body.services,
        paymentMethdod: req.body.paymentMethdod,
        paymentMade: req.body.paymentMade,
        payInCard: req.body.payInCard,
        payInCash: req.body.payInCash
    });

    scheduling.save(
        (err) => {
            if (err) {
                console.error('Erro ao realizar agendamento.', err);
                return res.status(500).send({message: 'Erro ao realizar agendamento.' + err.message});
            } else {
                return res.status(201).send({message: 'Agendamento realizado com sucesso'});
            }
        }
    );
    
}

exports.service_scheduling_delete = async (req, res, callback) => {
    Scheduling.findByIdAndRemove(req.params.id, (err) => {
        if (err){
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else {
            console.log('Agendamento Removido');
            res.status(200).send({message: 'Agendamento removido.'});
        }
    })
}

exports.service_get_by_professional = async (req, res, callback) => {
    let professional = await Professional.find({name: req.params.professional_name},
        (err) => {
            if(err) {
                console.log(err);
                res.status(500).send({message: 'Erro ao recuperar profissional.' + err.message});
            }
        }
    );

    if(professional === null || professional === undefined || professional.length < 1) {
        return res.status(404).send({message: 'Profissional não encontrado'});
    }

    let services = await Service.find({professional: professional[0]._id}, (err) => {
        if(err) {
            console.log(err);
            return res.status(500).send({message: 'Erro ao recuperar serviços. ' + err.message});
        }
    }).select('name identifier price _id');

    return res.status(200).send({services});
}

exports.service_get_all = async (req, res, callback) => {
    let services = await Service.find({}, (err) => {
        if(err){
            console.error(err);
            return res.status(400).send({error: err.message});
        }
    });

    result = []
    for(let i = 0 ; i < services.length ; i++) {
        const professional = await Professional.findById(services[i].professional, (err) => {
            if(err) {
                console.error(err);
                return res.status(500).send({message: 'Erro ao recuperar profissional.' + err.message});
            }
        });
        if(!professional) {
            return res.status(404).send({message: 'Profissional responsavel não encontrado'});
        }
        result.push(
            {
                identifier: services[i]['identifier'],
                name: services[i]['name'], 
                price: services[i]['price'], 
                professional: professional.name
            }
        );
    }
    services = result;
    return res.status(200).send({services});
}

exports.service_update = async(req, res, callback) => {
    Service.findOneAndUpdate({identifier: req.params.service_identifier}, 
        {$set: req.body}, (err, service) => {
        if (err) {
            console.error(err);
            res.status(400).send({erro: err.message});
            return callback(err);
        } else {
            res.status(200).send({message: 'Serviço atualizado.'});
        }
    });
}
exports.service_details = async(req, res, callback) => {
    const service = await Service.find({identifier: req.params.service_identifier}, (err) => {
        if (err) {
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } 
    });

    if(service !== null && service !== undefined && service.length > 0) {
        return res.status(200).send({service: service[0]});
    } else {
        return res.status(404).send({service: 'Serviço não encontrado.'});
    }
}

exports.service_register = async (req, res, callback) => {
    const professional = await Professional.find({name: req.body.professional_name},(err) => {
        if(err) {
            console.error('Erro ao buscar profissional responsavel', err);
            return res.status(500).send({message: 'Erro ao buscar profissional.' + err.message});
        }
    });

    if(professional === null || professional === undefined || professional.length < 1) {
        return res.status(404).send({message: 'Profissional não encontrado'});
    }

    const service = new Service({
        name: req.body.name,
        identifier: req.body.identifier,
        price: req.body.price,
        other: req.body.other,
        professional: professional[0]._id
    });

    service.save(
        (err) => {
            if (err) {
                console.error('Erro ao salvar Serviço', err);
                return res.status(500).send({message: 'Erro ao salvar Serviço' + err.message})
            } else {
            return res.status(201).send({message: 'Serviço criado com sucesso!'});
            }
        }
    );
}