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
    var salary = null;
    if (req.body.salary != null) {
        manager = req.body.salary;
    }

    con.query(`SELECT DepID FROM department WHERE Name = '${req.body.depName}'`,(err,results)=>{
        con.query(`INSERT INTO scientist (Firstname,LastName,Salary,ManagerID,DepID,username,password) VALUES ('${req.body.FirstName}','${req.body.LastName}',${salary},${manager},${results[0].DepID},'${req.body.username}','${req.body.password}')`,(err,result)=>{
            if (err) throw err;
            console.log("successful");
            res.end("successful");
        });
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
        con.query(`INSERT INTO project VALUES('${req.body.name}',${req.body.description},${req.query.scientistID},${req.body.depID})`,(err,result)=>{
            con.query(`INSERT INTO scientist_project_participation VALUES(${result.insertID},${req.query.scientistID})`,(err,result)=>{
                if (err) throw err;
                console.log("successful");
                res.end("successful");
            })
        });
    }
});



app.get('/api/get/scientists',(req,res)=>{ 
        con.query('SELECT * FROM `scientist` ', (err,result) => {
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });
});

app.get('/api/get/scientists/:project',(req,res)=>{//add view + edit
    con.query(`SELECT * FROM SCIENTIST_PROJECT WHERE projname = '${req.params.project}' `,(err,result)=>{
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });
});

app.get("/api/get/department/projects/:depName",(req,res)=>{
    con.query(`SELECT projname as 'Project Name', projDesc as 'Project Description' FROM projects_department WHERE name= '${req.params.depName}'`,(err,results)=>{
        res.end(JSON.stringify(results));
    })
})

app.get('/api/get/all/project',(req,res)=>{ // get all projects
    con.query(`SELECT p.ProjID,p.Name,p.Description,d.Name as Department,CONCAT(s.FirstName,' ', s.LastName) as ManagerName FROM project p INNER JOIN scientist s on s.ID = p.ProjectManager INNER JOIN department d on p.Department = d.DepID
`,(err,result)=>{
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });
});

app.delete('/api/delete/scientist/:scientistID',(req,res)=>{
    con.query(`DELETE FROM scientist where ID = ${req.params.scientistID}`,(err,result)=>{
        if (err) throw err;
        res.end("Successful");
    });
});

app.delete('/api/delete/project/:projectName',(req,res)=>{
    con.query(`DELETE FROM project where Name = "${req.params.projectName}"`,(err,result)=>{
        if (err) throw err;
        res.end("Successful");
    });
});

app.get('/api/get/scientist/projs/:scientistID',(req,res)=>{
    con.query(`SELECT projname AS name, Description FROM SCIENTIST_PROJECT WHERE ID = ${req.params.scientistID} `,(err,results)=>{
        res.end(JSON.stringify(results));
    });
});

app.get('/api/get/scientist/results/:scientistID',(req,res)=>{
    con.query(`SELECT projname, data from SCIENTIST_CONTRIBUTION_RESULTS where ID = ${req.params.scientistID}`,(err,results)=>{
        if (err) throw err;
        res.end(JSON.stringify(results));
        console.log("successful")
    });
});

app.get('/api/get/proj/result/:projName',(req,res)=>{
    con.query(`SELECT Data FROM project p INNER JOIN results_yielded r ON p.ProjID = r.ProjID WHERE p.Name  = '${req.params.projName}'`,(err,results)=>{
        if (err) throw err;
        res.end(JSON.stringify(results))
    });
});

app.get('/api/get/department/scientists/:depName',(req,res)=>{
    con.query(`SELECT ID,FirstName,LastName FROM ScientistsInDep WHERE name = "${req.params.depName}"`,(err,results)=>{
        if (err) throw err;
        res.end(JSON.stringify(results));
    });
});

app.get('/api/get/dep/results/:depName',(req,res)=>{
    con.query(`SELECT projname,data from department_project_result where name = "${depName}"`,(err,results)=>{
        res.end(JSON.stringify(results));
    });
});

app.get('/api/get/resources',(req,res)=>{
    con.query(`SELECT * FROM resources`,(err,results)=>{
        res.end(JSON.stringify(results));
    });
});

app.post('/api/edit/cost/resource',(req,res)=>{
    con.query(`UPDATE resources SET Cost = ${req.body.cost} WHERE ResourceID = ${req.body.resID};`,(req,result)=>{
        res.end("success");
    });
});

app.post('/api/add/resource',(req,res)=>{
    con.query(`INSERT INTO resources ( Name, Description, Cost) VALUES ( '${req.body.name}', '${req.body.description}', '${req.body.cost}');`,(req,result)=>{
        res.end("success");
    });
});

app.delete('/api/Delete/resource/:name',(req,res)=>{
    con.query(`DELETE FROM resource WHERE Name ="${req.params.name}"');`,(req,result)=>{
        res.end("success");
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