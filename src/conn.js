import mysql from 'mysql2'
const conn = mysql.createConnection({
    host: 'localhost',
    user: "root",
    database: "AlertBot",
    password: "password",
})
conn.connect(err =>{
    if(err){
        console.log(err)
    }else{
        console.log('Database ------ ok');
    }
})
export default conn

