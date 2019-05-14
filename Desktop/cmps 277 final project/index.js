var express = require('express');
var con = require('./dbconfig.js');

var app = express();
app.use(express.json())
// app.use(bodyParser);

app.post('/api/add/scientist',function(req,res){
    con.query(`INSERT INTO scientist VALUES(${req.body.id},'${req.body.name}','${req.body.fName}',${req.body.salary},${req.body.managerID},${req.body.depID})`,(err,result)=>{
        if (err) throw err;
        console.log("successful");
        res.end("successful");
    });
});


app.post('/api/add/project',function(req,res){
    con.query(`INSERT INTO project VALUES(${req.body.id},'${req.body.name}','${req.body.fName}',${req.body.salary},${req.body.managerID},${req.body.depID})`,(err,result)=>{
        if (err) throw err;
        console.log("successful");
        res.end("successful");
    });
});

app.get('/api/getall/scientists',function(req,res){
        con.query('SELECT * FROM `scientist` ', (err,result) => {
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });
    
});

app.get('/api/get/scientists/:project',function(req,res){
    con.query(`SELECT * FROM scientist s INNER JOIN scientist_project_participation sp ON s.ID = sp.ScientistID INNER JOIN project p on p.ProjID = sp.ProjectID WHERE p.Name = '${req.params.project}' `,(err,result)=>{
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });

});



app.listen(8080,()=>{console.log('listening on port 8080')});

















 // Object.keys(result).forEach(function(key) {
        //     var row = result[key];
        //     console.log(JSON.stringify(row)); 
        // });
        // console.log(result);
        // res.end(result);