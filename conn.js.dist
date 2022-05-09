var mysql = require('mysql2')
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: "root",
    database: "AlertBot",
    password: "password",
    // socketPath : '/run/mysqld/mysqld.sock'
})
conn.connect(err =>{
    if(err){
        console.log(err)
    }else{
        console.log('Database ------ ok');
    }
})
module.exports = conn

