/**
 * Created by lizi on 16/4/26.
 */
var Executor = require("../lib/executor");
var Command = require("../lib/command");

//设置连接池配置,如果不设置则使用LIB里的config文件
Executor.setPoolConfig(require("./config.json"));

//设置Redis配置,如果不设置则为本机
Executor.setRedisConfig(require("./redisConfig.json"));

//初始化command
var command  = new Command("SELECT * FROM dataAccess",[]);
var command1 = new Command("INSERT INTO dataAccess (test,test1) VALUES(?,?)",["t1","t2"]);
var command2 = new Command("UPDATE dataAccess SET test = ?,test1 = ?",["u1","u2"]);
var command3 = new Command("DELETE FROM dataAccess WHERE id = ?",[1]);
var command4 = new Command("INSERT INTO dataAccess (test,test1) VALUES(?,?)",["t4","t5"]);
//执行查询
//Executor.query("test",command,function(e,r)
//{
//    console.log(e);
//    console.log(r);
//});
//
////执行事物
//Executor.transaction("test",[command1,command4],function(e,r)
//{
//    console.log(e);
//    console.log(r);
//});
//
////redis 设置
//Executor.redisSet("test","key","dsadasdas");
//
////redis 获取
//Executor.redisGet("test","555",function(e,r)
//{
//    console.log(e);
//    console.log(r);
//});

Executor.redisSetObject('test',"object",{name:1,v:2});

Executor.redisGetObject('test','object',function(e,r)
{
    console.log(r);
});













