# 使用
```
 npm install dataAccess -save
```
#Test
```
var  Executor = require("dataAccess").Executor;
var  Command = require("dataAccess").Command;
//设置连接池配置,如果不设置则使用LIB里的config文件
Executor.setPoolConfig(require("./config.json"));

var command = new Command("SELECT * FROM dataAccess",[]);
var command1 = new Command("INSERT INTO dataAccess (test,test1) VALUES(?,?)",["t1","t2"]);
var command2 = new Command("UPDATE dataAccess SET test = ?,test1 = ?",["u1","u2"]);
var command3 = new Command("DELETE FROM dataAccess WHERE id = ?",[1]);
var command4 = new Command("INSERT INTO dataAccess (test,test1) VALUES(?,?)",["t4","t5"]);

var command5 = new Command("INSERT INTO dataAccess (test,test1) VALUES(?,?)",["t5","t6"]);
Executor.query("test",command1,function(e,r)
{
    console.log(e);
    console.log(r);
});

Executor.transaction("test",[command1,command4,command5],function(e,r)
{
    console.log(e);
    console.log(r);
});
```

