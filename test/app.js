/**
 * Created by lizi on 16/4/26.
 */
//var dataAccess = require("dataAccess");
//var executor =dataAccess.executor;
//var command = dataAccess.command;

var executor = require('../lib/executor');
var command = require('../lib/command');

//设置连接池配置,如果不设置则使用LIB里的config文件
executor.setPoolConfig(require("./config.json"));

//设置Redis配置,如果不设置则为本机
executor.setRedisConfig(require("./redisConfig.json"));

//初始化command
var c1  = new command("SELECT * FROM dataAccess",[]);
var c2 = new command("INSERT INTO dataAccess (test,test1) VALUES(?,?)",["t1","t2"]);
var c3 = new command("UPDATE dataAccess SET test = ?,test1 = ? WHERE id = ?",["u1","u2"]);
c3.exeBefore = function()
{
    this.params.push(this.lastResult.insertId);
}
var c4 = new command("DELETE FROM dataAccess WHERE id = ?",[1]);
//执行查询
//executor.query("test",c3,function(e,r)
//{
//    console.log(e);
//    console.log(r);
//});

//执行事物
executor.transaction("test",[c2,c3],function(e,r)
{
    //console.log(e);
    //console.log(r);
});

////redis 设置
//executor.redisSet("test","key1","ke1test");
//
////redis 获取
//executor.redisGet("test","key1",function(e,r)
//{
//    console.log(e);
//    console.log(r);
//});
//
////redis 设置对象
//executor.redisSetObject('test',"object1",{name:1,v:2});
//
////redis 读取对象
//executor.redisGetObject('test','object1',function(e,r)
//{
//    console.log(r);
//});
//
////redis 删除对象
//executor.redisDelete('test','object1');