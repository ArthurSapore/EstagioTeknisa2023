const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const programmer = require('./database/tables/programmer');

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

app.post('/createProgrammer', async(req, res)=>{
    try{
        const params = req.body;
        const properties = ['name', 'javascript', 'java', 'python'];
        const check = properties.every((property)=>{
            return property in params;
        });

        if(!check){
            const propStr = properties.join(',');
            res.send('All parameters needed to create a programmer must be sent:', propStr);
            return;
        }

        const newProgrammer = await programmer.create({
            name: params.name,
            javascript: params.javascript,
            java: params.java,
            python: params.python
        }) 
        res.send(newProgrammer);

    }catch(error){
        res.send(error);
    }
})

app.get('/retrieveProgrammer/:id', async(req, res)=>{  
    try{
        const record = await programmer.findByPk(req.params.id);
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

app.get('/retrieveProgrammer', async(req, res)=>{  
    const records = await programmer.findAll();
    res.send(records);
})

app.delete('/deleteProgrammer', async(req, res)=>{
    try{
      const params = req.body;
      if(!('id' in params)){
        res.send(   'Missing "id" in request body');
        return;
      }
      const record = await programmer.findByPk(params.id);

      if(!record){
        res.send(   'Programmer not found!');
        return;
      }

      await record.destroy();

    }catch(error){
        res.send(error);
    }
})

app.put('/updateProgrammer', async(req, res)=>{
    const params = req.body;

    if(!('id' in params)){
        res.send(   'Missing "id" in request body');
        return;
    }

    const record = await programmer.findByPk(params.id);
    if(!record){
        res.send(   'Missing "id" in request body');
        return;
    }

    const properties = ['name', 'javascript', 'java', 'python'];
    const check = properties.every((property)=>{
        return property in params;
    });

    if(!check){
        const propStr = properties.join(',');
        res.send('All parameters needed to create a programmer must be sent:', propStr);
        return;
    }

    record.name = params.name || record.name;
    record.javascript = params.javascript || record.javascript;
    record.java = params.java || record.java;
    record.python = params.python || record.python;

    await record.save();
    res.send('Programmer updated!');

})

app.listen(port, ()=>{
    console.log('Now listening on port', port);
})