const Medical_Exams = require('../models/medical_exams.model');

exports.exams_get_all = async(req, res, callback) => {
  const plans = await Medical_Exams.find({type: req.params.type}, (err) => {
      if(err){
          console.error(err);
          return res.status(400).send({error: err.message});
      }
  }).select('name');

  return res.status(200).send({plans});
};


exports.exams_create = (req, res, callback) => {
    let plan = new Medical_Exams({
        name: req.body.name,
        type: req.body.type
    });

    plan.save( (err) =>  {
        if(err) {
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else{
            console.log('Exame cadastrado com sucesso');
            res.status(200).send({message: 'Exame cadastrado com sucesso'});
        }
    });
};

exports.exams_update = (req, res, callback) => {
    Medical_Exams.findOneAndUpdate({name: req.params.name}, {$set: req.body}, (err, exam) => {
        if (err) {
            console.error(err);
            res.status(400).send({erro: err.message});
            return callback(err);
        } else {
            console.log('Exame atualizado.');
            res.status(200).send({message: 'Exame atualizado.'});
        }
    });
};

exports.exams_delete = (req, res, callback) => {
    Medical_Exams.deleteOne({name: req.params.name}, (err) => {
        if (err){
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else {
            console.log('Exame Removido');
            res.status(200).send({message: 'Exame removido.'});
        }
    })
};