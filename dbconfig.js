const mysql = require('mysql');

var con = mysql.createConnection({
    host: '51.77.192.7',
    user: 'commandeers',
    password: 'Commandeers1234',
    database: 'ScientificHub'
});

setInterval(()=>{
    //Because the services shut down if it is idle.
    con.query("Select 1");
},5000);

module.exports = con;