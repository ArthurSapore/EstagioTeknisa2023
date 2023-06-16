const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const programmerCpf = require('./database/tables/programmerCpf');

const app = express();
const port = 5000;
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methor: 'POST'
};
  
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/syncDatabase', async(req, res)=>{
    const  database = require('./database/db');
    try{
        await database.sync();
        res.send('Database successfully sync');
    }catch(error){
        res.send(error);
    }
})

app.post('/createProgrammerCpf', async(req, res)=>{
    try{
        const params = req.body;
        const properties = ['cpf'];
        const check = properties.every((property)=>{
            return property in params;
        });

        if(!check){
            const propStr = properties.join(',');
            res.send('All parameters needed to create a programmer must be sent:'+ propStr);
            return;
        }

        const newProgrammerCpf = await programmerCpf.create({
            cpf: params.cpf
        }) 
        res.send(newProgrammerCpf);

    }catch(error){
        res.send(error);
    }
})

app.get('/retrieveProgrammerCpf/:id', async(req, res)=>{  
    try{
        const record = await programmerCpf.findByPk(req.params.id);
        if(record){
            res.send(record);
        }else{
            res.send('No programmer found.');
        }
        return;
    }catch(error){
        res.send(error);
    }
})


app.listen(port, ()=>{
    console.log('Now listening on port', port);
})