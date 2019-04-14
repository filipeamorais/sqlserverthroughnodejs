var Connection = require('tedious').Connection; 
var Request = require('tedious').Request;
fs = require('fs');
var sql = require ('mssql/msnodesqlv8').Connection;


var data = fs.readFileSync('./login_info');
data = data.toString();

var arr = data.split(",");
var myUsername = arr[0] + "@mydbserverfam";
var myPassword = arr[1];
var myDbname = arr[2];
var myServername = arr[3] + ".database.windows.net";
console.log(myUsername+' '+myPassword+' '+myDbname+' '+myServername)

//Connection parameters to database

// var config={
//     server: 'mydbserverfam.database.windows.net',
//     options: { 
//         userName: 'filipeam',
//         password: '0dQYS4xivBst',
//         encrypt:true,
//         database:'MyDB'
//     }
// }   
 var config = 
 {
    authentication: {
        options: {
	        userName:  myUsername,
            password:  myPassword,
        },
        type: 'default'
    },
    server: myServername,
	options: {
		database:  myDbname,
		encrypt: true
	}
}


var connection = new Connection(config);
console.log(connection);
connection.on('connect',function(err){
    if(err){
        console.log(err)
    }else{
        console.log("Connected")
        queryDatabase()
    }
});

// var conn = new sql(config);
// console.log(conn);
// conn.connect(function (err) {
//     if (err) {
//         console.log(err);
//         return;
//     }
// });


function queryDatabase(){
    console.log('Reading rows from the Table...');
    
    var request = new Request(
        "SELECT * FROM Persons",
        function(err, rowCount, rows){
            console.log(rowCount+'row(s) returned');
            process.exit();
        }
    );

    request.on('row',function(columns){
        columns.forEach(function(column){
            console.log("%s\t%s",column.metadata.colName,column.value);
        });
    });
    connection.execSql(request);
}
