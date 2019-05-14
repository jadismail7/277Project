const mysql = require('mysql');

var con = mysql.createConnection({
    host: '51.77.192.7',
    user: 'commandeers',
    password: 'commandeers1234',
    database: 'SCIENTIFIC_HUB'
});

setInterval(()=>{
    //Because the services shut down if it is idle.
    con.query("Select 1");
},10000)

module.exports = con;