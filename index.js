var express = require('express');
var con = require('./dbconfig.js');

var app = express();
app.use(express.json())
// app.use(bodyParser);

app.post('/api/add/scientist',(req,res)=>{ //for registering a scientist
    var manager = null;
    if (req.body.managerID != null) {
        manager = req.body.managerID;
    }
    con.query(`INSERT INTO scientist VALUES('${req.body.name}','${req.body.fName}',${req.body.salary},${req.body.managerID},${req.body.depID})`,(err,result)=>{
        if (err) throw err;
        console.log("successful");
        res.end("successful");
    });
});


app.post('/api/add/project',(req,res)=>{ // adding a project
    con.query(`INSERT INTO project VALUES('${req.body.name}',${req.body.managerID},${req.body.depID})`,(err,result)=>{
        if (err) throw err;
        console.log("successful");
        res.end("successful");
    });
});

app.post("/api/add/resource",(req,res)=>{
    
});

app.get('/api/getall/scientists',(req,res)=>{ 
        con.query('SELECT * FROM `scientist` ', (err,result) => {
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });
});

app.get('/api/get/scientists/:project',(req,res)=>{//add view + edit
    con.query(`SELECT * FROM scientist s INNER JOIN scientist_project_participation sp ON s.ID = sp.ScientistID INNER JOIN project p on p.ProjID = sp.ProjectID WHERE p.Name = '${req.params.project}' `,(err,result)=>{
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });

});

app.get('/api/get/all/project',(req,res)=>{ // get all projects
    con.query(`SELECT * FROM project`,(err,result)=>{
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });
});

app.delete('/api/delete/scientist/:FName/:LName',(req,res)=>{
    con.query(`DELETE FROM scientist where FirstName = "${req.params.FName}" AND LastName = "${req.params.LName}"`,(err,result)=>{
        if (err) throw err;
        res.end("Successful");
    });
});

app.delete('/api/delete/scientist/:projectName',(req,res)=>{
    con.query(`DELETE FROM project where Name = "${req.params.projectName}"`,(err,result)=>{
        if (err) throw err;
        res.end("Successful");
    });
});





app.listen(8080,()=>{console.log('listening on port 8080')});