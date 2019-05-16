var express = require('express');
var con = require('./dbconfig.js');
var livereload  = require("connect-livereload");
var cors = require("cors");
var app = express();


app.use(express.json())

// app.use((req, res, next)=>{
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

var corsOptions = {
    origin: '*',
    credentials: true
};

app.use(cors(corsOptions));



app.use(livereload());

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

app.get("/api/get/executives",(req,res)=>{
    con.query(`SELECT * FROM executive_board`,(err,result)=>{
        res.end(JSON.stringify(result));
    })
})

app.post('/api/add/project',(req,res)=>{ // adding a project
    if (!req.query.scientistID) {
        res.end("unauthorized");
    } else {
        con.query(`INSERT INTO project VALUES('${req.body.name}',${req.body.managerID},${req.body.depID})`,(err,result)=>{
            con.query(`INSERT INTO scientist_project_participation VALUES(${result.insertID},${req.query.scientistID})`,(err,result)=>{
                if (err) throw err;
                console.log("successful");
                res.end("successful");
            })
        });
    }
});

app.post("/api/add/resource",(req,res)=>{
    
});

app.get('/api/get/scientists',(req,res)=>{ 
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

app.get("/api/get/department/projects/:depID",(req,res)=>{
    con.query(`SELECT projname as 'Project Name', projDesc as 'Project Description' FROM projects_department WHERE depId=${req.params.depID}`,(err,results)=>{
        res.end(JSON.stringify(results));
    })
})

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




/*
            MEN HON W NZOUL ANA 3MELTON. MA TOD2ARON YA KHANZEYOYOYOYOYYOOOOR
                                                                                        */
app.post("/api/authenticate",(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;

    con.query(`SELECT id,password FROM scientist where username='${username}'`,(err,result)=>{
        if (result.length == 0) {
            res.end("Fail");
        }
        else if (password == result[0].password){
            res.end(JSON.stringify({success:1, id: result[0].id}));
        } else {
            res.end(JSON.stringify({success: 0}));
        }
    })
})

app.get("/api/get/my/managees",(req,res)=>{
    if (!req.query.scientistID) {
        res.end("unauthorized");
    } else {
        con.query("SELECT s2.ID, s2.FirstName, s2.LastName from scientist s1 inner join scientist s2 on s1.ID = s2.ManagerID WHERE s1.ID = "+req.query.scientistID,(err,result)=>{
            res.end(JSON.stringify(result));
        })
    }
});

app.get("/api/get/my/manager",(req,res)=>{
    if (!req.query.scientistID) {
        res.end('unauthorized');
    } else {
        con.query("Select s2.ID, s2.FirstName, s2.LastName from scientist s1 inner join scientist s2 on s1.ManagerID = s2.ID WHERE s1.id = "+req.query.scientistID, (err,result)=>{
            res.end(JSON.stringify(result[0]));
        })
    }
})

app.get("/api/get/my/department",(req,res)=>{
    if (!req.query.scientistID) {
        res.end('unauthorized');
    } else {
        con.query(`SELECT d.DepID, d.HodID, d.Name, d.Location FROM scientist s JOIN department d on s.DepID = d.DepID WHERE s.id = ${req.query.scientistID}`,(err,result)=>{
            res.end(JSON.stringify(result));
        })
    }
});

app.delete("/api/delete/managee/:manageeID",(req,res)=>{
    if (!req.query.scientistID) {
        res.end('unauthorized');
    } else {
        con.query(`UPDATE scientist SET ManagerID = null WHERE id = ${req.params.manageeID} AND managerID = ${req.query.scientistID}`,(err,result)=>{
            if (result.affectedRows == 1) {
                res.end("Deleted managee");
            } else {
                res.end("Managee either does not exist, already doesn't have a manager, or is not your managee");
            }
        });
    }
});


app.get("/api/add/managee/:manageeID",(req,res)=>{
    if (!req.query.scientistID) {
        res.end("unauthorized");
    } else {
        con.query(`SELECT ManagerID from scientist WHERE id = ${req.params.manageeID}`,(err,result)=>{
            con.query(`UPDATE scientist SET ManagerID = ${req.query.scientistID} WHERE id=${req.params.manageeID} and ManagerID <> NULL`,(err,result)=>{
                res.end("Manager Changed!");
                if (result.affectedRows == 1) {
                    res.end("Manager Changed!");
                } else {
                    res.end("Already has a manager")
                }
            });
        });
    }
});

app.get("/api/get/my/projs",(req,res)=>{
    if (!req.query.scientistID) {
        res.end("unauthorized");
    } else {
        con.query(`SELECT s1.ID,s1.FirstName,s1.LastName, p.ProjID, p.Name, p.Description, p.Department, s2.ID as 'Project Manager ID',s2.FirstName as 'PManager First Name', s2.LastName as 'PManager Last Name' FROM scientist s1 JOIN scientist_project_participation sp on s1.ID = sp.ScientistID JOIN project p on sp.ProjectID = p.ProjID JOIN scientist s2 on p.ProjectManager = s2.ID WHERE s1.ID = ${req.query.scientistID}`, (err,result)=>{
            res.end(JSON.stringify(result));
        })
    }
});

app.delete("/api/quit/proj/:projid",(req,res)=>{
    if (!req.query.scientistID) {
        res.end("unauthorized");
    } else {
        con.query(`DELETE FROM scientist_project_participation WHERE ScientistID=${req.query.scientistID} AND ProjectID=${req.params.projid}`,(err,result) =>{
            if (result.affectedRows == 1) {
                res.end("Project successfully quit");
            } else {
                res.end("You are not in this project");
            }
        })
    }
});

app.get("/api/join/proj/:projid",(req,res)=>{
    if (!req.query.scientistID) {
        res.end("unauthorized");
    } else {
        con.query(`INSERT INTO scientist_project_participation VALUES(${req.params.projid},${req.query.scientistID})`,(err,result)=>{
            if (err) {res.end("You are already in this project")}
            else{
                res.end("Successfully joined project");
            }
        });
    }
});

app.get("/api/logout",(req,res)=>{
    if (!req.query.scientistID) {
        res.end("Already logged out");
    } else {
        req.query.scientistID = null;
        res.end("Logged out successfully");
    }
})


app.listen(8085,()=>{console.log('listening on port 8085')});