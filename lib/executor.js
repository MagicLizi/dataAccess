/**
 * Created by lizi on 16/4/26.
 * 数据访问执行者,用于外部调用
 */
var Code = require("./Code");
var Command = require("./command");
var ExeConnection = require("./exeConnection");
var Async = require("async");
/**
 * 设置连接池配置
 * @param config
 */
exports.setPoolConfig = function(config)
{
    ExeConnection.poolsConfig = config;
};

/**
 * 执行操作
 * @param name 池对象名字和配置中的KEY保持一致即可
 * @param command 执行命令对象
 * @param callback 回调
 */
exports.query = function(name,command,callback)
{
    execute(name,[command],callback);
};


/**
 * 执行事物
 */
exports.transaction = function(name,commands,callback)
{
    execute(name,commands,callback);
};

/**
 * 执行数据操作
 * @param exeType 执行类型
 * @param name 池对象名字和配置中的KEY保持一致即可
 * @param command 执行命令
 * @param callback 回调
 */
var execute = function(name,commands,callback)
{
    //判断类型
    for(var i = 0;i<commands.length;i++)
    {
        var command = commands[i];
        if(!(command instanceof Command))
        {
            throw new Error("Code:"+Code.commandClassError+" 请使用Command对象!",Code.commandClassError);
        }
    }

    //获取连接
    var exeConnection = new ExeConnection();
    exeConnection.getConnection(name,function(error,connection)
    {
        if(error)
        {
            callback(error,null);
        }
        else
        {
            if(commands.length === 1)
            {
                var command = commands[0];
                connection.query(command.sql,command.params, function(err, rows) {
                    connection.release();
                    callback(err,rows);
                });
            }
            else
            {
                //事物
                connection.beginTransaction(function(err)
                {
                    if(err)
                    {
                        //开始事物错误
                        connection.release();
                        callback(err,null);
                    }
                    else
                    {
                        //事物任务
                        var transactionTasks = [];
                        var commandLength = commands.length;
                        var j = 0;
                        for(var i = 0;i<commandLength;i++)
                        {
                            var task = function(cb)
                            {
                                var command = commands[j];
                                j++;
                                connection.query(command.sql,command.params, cb);
                            };
                            transactionTasks.push(task);
                        }


                        Async.series(transactionTasks,function(err,res)
                        {
                            if(err)
                            {
                                //任务出错回滚
                                connection.rollback(function()
                                {
                                    connection.release();
                                    callback(err,null);
                                });
                            }
                            else
                            {
                                //事物提交
                                connection.commit(function(err)
                                {
                                    if(err)
                                    {
                                        //提交错误回滚
                                        connection.rollback(function()
                                        {
                                            connection.release();
                                            callback(err,null);
                                        });
                                    }
                                    else
                                    {
                                        connection.release();
                                        callback(null,res);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
};




