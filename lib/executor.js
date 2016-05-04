/**
 * Created by lizi on 16/4/26.
 * 数据访问执行者,用于外部调用
 */
var code = require("./code");
var command = require("./command");
var exeConnection = require("./exeConnection");
var async = require("async");
/**
 * 设置连接池配置
 * @param config
 */
exports.setPoolConfig = function(config)
{
    exeConnection.poolsConfig = config;
};


/**
 * 设置REDIS配置
 * @param config
 */
exports.setRedisConfig = function(config)
{
    exeConnection.redisConfig = config;
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
        var com = commands[i];
        if(!(com instanceof command))
        {
            throw new Error("Code:"+code.commandClassError+" 请使用Command对象!",code.commandClassError);
        }
    }

    //获取连接
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
                var comm = commands[0];
                connection.query(comm.sql,comm.params, function(err, rows) {
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
                                var comm = commands[j];
                                comm.exeBefore();
                                connection.query(comm.sql,comm.params,function(ce,cr)
                                {
                                    if((j + 1) < commandLength)
                                    {
                                        var nextCommand = commands[j+1];
                                        nextCommand.lastResult = cr;
                                    }
                                    j++;
                                    cb(ce,cr);
                                });
                            };
                            transactionTasks.push(task);
                        }

                        //执行
                        async.series(transactionTasks,function(err,res)
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

/**
 * 从redis获取
 * @param key 键
 * @param callback 回调
 */
exports.redisGet = function(name,key,callback)
{
    exeConnection.getRedisClient(name).get(key,callback);
};

/**
 * 设置Redis
 * @param key 键
 * @param value 值
 */
exports.redisSet = function(name,key,value)
{
    exeConnection.getRedisClient(name).set(key,value);
};

/**
 * 设置Object
 * @param name 池名字
 * @param key 键
 * @param object 值
 */
exports.redisSetObject = function(name,key,object)
{
    exeConnection.getRedisClient(name).HMSET(key,object);
};

/**
 * 获取Object
 * @param name 池名字
 * @param key 键
 */
exports.redisGetObject = function(name,key,callback)
{
    exeConnection.getRedisClient(name).hgetall(key,callback);
};

/**
 * 从Redis删除
 * @param key 键
 * @param callback 回调
 */
exports.redisDelete = function(name,key)
{
    exeConnection.getRedisClient(name).del(key);
};




