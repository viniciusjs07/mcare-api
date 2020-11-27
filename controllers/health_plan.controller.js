const Health_Plan = require('../models/health_plan.model');

exports.plan_get_all = async(req, res, callback) => {
  const plans = await Health_Plan.find({}, (err) => {
      if(err){
          console.error(err);
          return res.status(400).send({error: err.message});
      }
  }).select('name discount');

  return res.status(200).send({plans});
};


exports.plan_create = (req, res, callback) => {
    let health= new Health_Plan({
        name: req.body.name,
        discount: req.body.discount
    });

    health.save( (err) =>  {
        if(err) {
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else{
            console.log('Plano de saúde cadastrado com sucesso');
            res.status(200).send({message: 'Plano de saúde cadastrado com sucesso'});
        }
    });
};

exports.plan_update = (req, res, callback) => {
    console.log(req.body);
    Health_Plan.findOneAndUpdate({name: req.params.name}, {$set: req.body}, (err, pĺan) => {
        if (err) {
            console.error(err);
            res.status(400).send({erro: err.message});
            return callback(err);
        } else {
            console.log('Plano de Saúde atualizado.');
            res.status(200).send({message: 'Plano de Saúde atualizado.'});
        }
    });
};

exports.plan_delete = (req, res, callback) => {
    Health_Plan.deleteOne({name: req.params.name}, (err) => {
        if (err){
            console.error(err);
            res.status(400).send({error: err.message});
            return callback(err);
        } else {
            console.log('Plano Removido');
            res.status(200).send({message: 'Plano removido.'});
        }
    })
};