var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
fs=require('fs');

var data = fs.readFileSync('./login_info');
data = data.toString();

var arr = data.split(",")
var myUsername = arr [0];
var myPassword = arr [1];
var myDbname = arr [2];
var myServername = arr[3] + ".database.windows.net";

//Connection parameters to database
config={
    server:myServername,
    userName:myUsername,
    password:myPassword,
    options:{
        database:myDbname,
        encrypt:true
    }
}

var connection=new Connection(config);
connection.on('connect',function(err){
    if(err){
        console.log(err)
    }else{
        queryDatabase()
    }
});

function queryDatabase(){
    console.log('Reading rows from the Table...');
    
    var request = new Resquest(
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
