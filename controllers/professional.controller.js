const Professional = require('../models/professional.model');
const Scheduling   = require('../models/scheduling.model');
const Service      = require('../models/service.model');
const Patient      = require('../models/patient.model');


exports.professional_get_all = async(req, res, callback) => {
    const professionals = await Professional.find({}, (err) => {
        if(err){
            console.error(err);
            return res.status(400).send({error: err.message});
        }
    }).select('_id name role expertise phone');

    return res.status(200).send({professionals});
};

exports.professional_create = (req, res, callback) => {
    let professional = new Professional({
        name: req.body.name,
        role: req.body.role,
        expertise: req.body.expertise,
        address: req.body.address,
        city: req.body.city,
        cpf: req.body.cpf,
        rg: req.body.rg,
        phone: req.body.phone,
        email: req.body.email,
        maritalStatus: req.body.maritalStatus,
        login: req.body.login,
        password: MD5(req.body.password)
    });

    professional.save((err) => {
        if(err){
            console.log(err);
            res.status(400).send({error: err.message});
            return callback(err);
        }
        console.log('Profissional da Saúde cadastrado com Sucesso!');
        res.status(201).send({message: 'Profissional da Saúde cadastrado com Sucesso!'});
    });
};

exports.professional_detail = (req, res, callback) => {
    Professional.findById(req.params.id, (err, professional) => {
        if(err){
            console.log(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else {
            if (professional === null || professional === undefined) res.status(404).send({message: 'Usuário não encontrado'});
            else res.status(200).send({professional});
        }
    });
};

exports.professional_update = (req, res, callback) => {
    Professional.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, professional) => {
        if(err) {
            console.log(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else {
            res.status(200).send({message: 'Profissional atualizado com sucesso.'});
        }
    });
};

exports.professional_delete = (req, res, callback) => {
  Professional.findByIdAndRemove(req.params.id, (err) => {
     if(err) {
         console.log(err);
         res.status(400).send({error: err.message});
         return callback(err);
     } else {
         res.status(200).send({message: 'Profissional removido com sucesso.'});
     }
  });
};

exports.professional_generate_simple_report = async (req, res, callback) => {
    
    const initialDate = new Date(req.body.initialDate);
    const finalDate  = new Date(req.body.finalDate);
    
    let schedules = await Scheduling.find({status: 'Atendido'}, 
        (err) => {
            if (err) {
                return res.status(500).send({error: 'Erro ao recuperar agendamentos.'});
            }
        }
    );

    schedules = schedules.filter((element)=> {
            const schDate = new Date(element.date);
            if(schDate >= initialDate && schDate <= finalDate) return element;
    });

    let result = {}; 
    for (let schedule of schedules) {
        
        const schDate = new Date(schedule.date);
        month = schDate.getUTCMonth();

        let atualDateString = (month + 1) + '/' + schDate.getUTCFullYear();

        if (result[atualDateString]) {
            let cashValue = result[atualDateString][0];
            let cardValue = result[atualDateString][1];

            if (schedule.paymentMethdod.length > 10) { //Means Cash and Card

                result[atualDateString] = [cashValue + schedule.payInCash, cardValue + schedule.payInCard]

            } else if (schedule.paymentMethdod === 'Cartão') {

                result[atualDateString] = [cashValue, cardValue + schedule.finalPrice];

            } else {

                result[atualDateString] = [cashValue + schedule.finalPrice, cardValue];

            }

        } else {
            if (schedule.paymentMethdod.length > 10) { //Means Cash and Card
                result[atualDateString] = [schedule.payInCash, schedule.payInCard]
            } else if (schedule.paymentMethdod === 'Cartão') {
                result[atualDateString] = [0, schedule.finalPrice];
            } else {
                result[atualDateString] = [schedule.finalPrice, 0];
            }
        }

    }

    return res.status(200).send(result);

};

exports.professional_generate_report_single_date = async (req, res, callback) => {
    
    let schedules;

    if (req.body.date !== '') {
        schedules = await Scheduling.find({professional: req.body.professional, date: req.body.date, status: 'Atendido'}, (err, schedules) => {
            if(err) {
                console.log(err);
                return res.status(500).send({message: 'Erro ao buscar agendamentos. ' + err['message']});
            }
        });
    }else {
        schedules = await Scheduling.find({professional: req.body.professional, status: 'Atendido'}, (err, schedules) => {
            if(err) {
                console.log(err);
                return res.status(500).send({message: 'Erro ao buscar agendamentos. ' + err['message']});
            }
        });

        const initalDate = new Date(req.body.initialDate);
        const finalDate  = new Date(req.body.finalDate);

        schedules = schedules.filter((element)=> {
            const schDate = new Date(element.date);
            if(schDate >= initalDate && schDate <= finalDate) return element;
        });

    }

    if(schedules === null || schedules === undefined || schedules.length < 1) return res.status(404).send({message: 'Nenhum agendamento encontrado para os parametros informados.'});

    let finalSchedules = [];

    const professional = await Professional.findById(req.body.professional, (err) => {
        if(err) {
            console.log(err);
            return res.status(500).send({message: 'Erro ao recuperar profissional. ' + err['message']});
        }
    });

    if(!professional) return res.status(404).send({message: 'Profissional não encontrado.'});

    for(let i = 0; i < schedules.length ; i++) {
        services = [];
        for(let j = 0; j < schedules[i].services.length; j++) {
            const service = await Service.findById(schedules[i].services[j], (err) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send({message: 'Erro ao buscar serviço. ' + err['message']});
                }
            });
            if(!service) return res.status(404).send({message: 'Serviço não encontrado.'});
            else services.push(service.name);
        }

        let patient = await Patient.findById(schedules[i].patient, (err) => {
            if(err) {
                console.log(err);
                return res.status(500).send({message: 'Erro ao buscar paciente. ' + err['message']});
            }
        });

        if(patient === '' || patient === null || patient === undefined) { 
            patient = 'Paciente Removido do Sistema';
        } else {
            patient = patient.name;
        }

        finalSchedules.push({
            date: schedules[i].date,
            professional: professional.name,
            services: services,
            patient: patient
        });
    }

    schedules = finalSchedules;
    return res.status(200).send(schedules);
};

const MD5 = function(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_};
