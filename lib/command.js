/**
 * Created by lizi on 16/4/26.
 * sql  查询命令对象
 */
var code = require("./code");

/**
 * 构造函数 虽然可以用arguments 但是还是写一下显示参数吧,不然别人看不懂..
 * @param sql 语句
 * @param params 参数
 */
function command(sql,params)
{
    if(arguments.length<2)
    {
        throw new Error("Code:"+code.paramsLengthError+" Msg:参数数量错误,{sql,params}",code.paramsLengthError);
    }

    this.sql = sql;

    this.params = params;

    this.exeBefore = function()
    {

    };

    this.jump = false;

    this.lastResult = {};
}

module.exports = command;
