const express = require("express");
const app = express();
const jsonParser = express.json();

const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Clinic',
    password: '4444',
    port: 5432,
});

const select = require("./RequestSQL");

try {
    client.connect();
    console.log("Подключение успешно установлено");
    app.listen(3000);
}
catch(err) {
    console.log("Возникла ошибка");
    return console.log(err);
} 

app.get('/list/doctor', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);   
    try{
        client.query(select.listDoctor, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/list/client', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);   
    try{
        client.query(select.listClient, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/list/disease', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);   
    try{
        client.query(select.listDisease, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/report/patientsSpecificDisease', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);    
    let req = select.patientsSpecificDisease;
    let value = [
        request.query.name
    ];

    try{
        client.query(req, value, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/report/diseasesPatients', function(request, response){
    try{
        client.query(select.diseasesPatients, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/report/specialistsSpecificDisease', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);    
    let value = [ request.query.name ];

    try{
        client.query(select.specialistsSpecificDisease, value, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/report/patientsSpecificDoctor', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);    
    let value = [ request.query.name ];

    try{
        client.query(select.patientsSpecificDoctor, value, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/report/patientsSpecificDay', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);  
    
    let json = JSON.stringify([{
        date: [ request.query.date ]
    }]);

    try{
        client.query(select.patientsSpecificDay, [ json ], (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/report/specializationDoctors', function(request, response){
    try{
        client.query(select.specializationDoctors, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.post("/edit/repurposing", jsonParser, async(request, response)=> {
    if(!request.body) 
        return response.sendStatus(400);
         
    let text = select.repurposing;
    let value = [
        request.body.special,
        request.body.fio,
    ];

    try {
        await client.query(text, value);
        response.sendStatus(200);
    } 
    catch (err) {
        console.log(err);
        response.sendStatus(500);
    }
});

app.post("/edit/record", jsonParser, async(request, response)=> {
    if(!request.body) 
        return response.sendStatus(400);

    let data = request.body.data

    const visit = [];
    for (let doctor in data){
        visit.push({
            date: data[doctor],
            doctor_id: doctor
        })
    }

    try {
        await client.query(select.record, [JSON.stringify({ visits: visit }), request.body.nameId]);
        response.sendStatus(200);
    } 
    catch (err) {    
        console.log(err);
        response.sendStatus(500);
    }
});

app.post("/delete/dismiss", jsonParser, async(request, response)=> {
    if(!request.body)
        return response.sendStatus(400);
    try {
        await client.query(select.dismiss, [request.body.doctorId]);
        response.sendStatus(200);
    } 
    catch (err) {
        console.log(err);
        response.sendStatus(500);
    }
});

app.post("/add/doctor", jsonParser, async(request, response)=> {
    if(!request.body) 
        return response.sendStatus(400);

    let value = [
        request.body.specialist,
        request.body.name,
        request.body.telephone
    ];
    try {
        await client.query(select.addDoctor, value);
        response.sendStatus(200);
    } 
    catch (err) {
        console.log(err);
        response.sendStatus(500);
    }
});

app.post("/add/patient", jsonParser, async(request, response)=> {
    if(!request.body) 
        return response.sendStatus(400);

    let value = [
        request.body.name,
        request.body.telephone,
        request.body.address,
        request.body.doctor,
        request.body.disease
    ];
    try {
        await client.query(select.addPatient, value);
        response.sendStatus(200);
    } 
    catch (err) {
        console.log(err);
        response.sendStatus(500);
    }
});

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/Frontend'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/anychart/dist'));

app.get('/',                                function(request, response){ response.sendFile(__dirname + '/Frontend/Main.html');                              });

app.get('/page/listClient',                 function(request, response){ response.sendFile(__dirname + '/Frontend/Client/ListClient.html');              });
app.get('/page/newClient',                  function(request, response){ response.sendFile(__dirname + '/Frontend/Client/NewClient.html');               });
app.get('/page/record',                     function(request, response){ response.sendFile(__dirname + '/Frontend/Client/Record.html');                  });

app.get('/page/listDoctor',                 function(request, response){ response.sendFile(__dirname + '/Frontend/Doctor/ListDoctor.html');                 });
app.get('/page/dismiss',                    function(request, response){ response.sendFile(__dirname + '/Frontend/Doctor/Dismiss.html');                    });
app.get('/page/newDoctor',                  function(request, response){ response.sendFile(__dirname + '/Frontend/Doctor/NewDoctor.html');                  });
app.get('/page/repurposing',                function(request, response){ response.sendFile(__dirname + '/Frontend/Doctor/Repurposing.html');                });

app.get('/page/patientsSpecificDisease',    function(request, response){ response.sendFile(__dirname + '/Frontend/Reporting/PatientsSpecificDisease.html');    });
app.get('/page/diseasesPatients',           function(request, response){ response.sendFile(__dirname + '/Frontend/Reporting/DiseasesPatients.html');           });
app.get('/page/specialistsSpecificDisease', function(request, response){ response.sendFile(__dirname + '/Frontend/Reporting/SpecialistsSpecificDisease.html'); });
app.get('/page/patientsSpecificDoctor',     function(request, response){ response.sendFile(__dirname + '/Frontend/Reporting/PatientsSpecificDoctor.html');     });
app.get('/page/patientsSpecificDay',        function(request, response){ response.sendFile(__dirname + '/Frontend/Reporting/PatientsSpecificDay.html');        });
app.get('/page/specializationDoctors',      function(request, response){ response.sendFile(__dirname + '/Frontend/Reporting/SpecializationDoctors.html');      });
app.get('/statistic',      function(request, response){ response.sendFile(__dirname + '/Frontend/Diagram.html');      });

const selectSearch = require("./SearchSQL");
app.get('/search/listClient', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);    
    try{
        client.query(selectSearch.listClient(request.query.name), (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/search/listDoctor', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);    
    try{
        client.query(selectSearch.listDoctor(request.query.name), (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/search/diseasesPatients', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);    
    try{
        client.query(selectSearch.diseasesPatients(request.query.name), (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/search/specializationDoctors', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);    
    try{
        client.query(selectSearch.specializationDoctors(request.query.name), (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/client/card', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);    

    try{
        client.query('SELECT reception from patient where id = $1', [request.query.patientId]).then(res => {
            if (res.rows.length > 0) {
                const reception = res.rows[0].reception;    
                if (reception && reception.visits) {
                    const visits = reception.visits;
                    const promises = visits.map(async visit => {
                        const doctorRes = await client.query('SELECT fio from doctor where id = $1', [visit.doctor_id]);
                        return { doctor: doctorRes.rows[0].fio, date: visit.date };
                    });
                    return Promise.all(promises);
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        })
        .then(results => {
            if (results.length > 0) {
                const map = new Map();
                results.forEach(result => {
                    if (!map.has(result.doctor)) {
                        map.set(result.doctor, []);
                    }
                    map.get(result.doctor).push(result.date);
                });
                response.json(Object.fromEntries(map));
            }
            else {
                response.json({});
            }
        })
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});

app.get('/doctor/specialization', function(request, response){  
    if(!request.query) 
        return response.sendStatus(400); 
    try{
        client.query('select * from specialization', (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
    
});

app.get('/get/statistic', function(request, response){
    if(!request.query) 
        return response.sendStatus(400);   
    try{
        client.query(select.static, (err, res) => { 
            if (err) { 
                console.error(err.stack); 
                return; 
            }
            response.json(res.rows);
        }); 
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }  
});