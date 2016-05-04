/**
 * Created by lizi on 16/4/26.
 * 命令执行连接对象,采用连接池
 */
var mysql = require("mysql");
var redis = require("redis");
var code = require("./code");
var exeConnection = module.exports;
/**
 * 池集群
 * @type {null}
 */
exeConnection.poolCluster = null;

/**
 * 集群池配置
 * @type {null}
 */
exeConnection.poolsConfig = null;

/**
 * 从池中获取连接
 * @param name 池名字
 * @param callback 回调
 */
exeConnection.getConnection = function(name,callback)
{
    if(exeConnection.poolCluster === null)
    {
        exeConnection.poolCluster = mysql.createPoolCluster();

        var Config = exeConnection.poolsConfig ? exeConnection.poolsConfig : require("./config");

        for(tempName in Config)
        {
            var config = Config[tempName];
            exeConnection.poolCluster.add(tempName, config);
        }
    }
    exeConnection.poolCluster.getConnection(name,callback);
};


/**
 *  redis配置
 * @type {null}
 */
exeConnection.redisConfig = {};

/**
 * REDIS 对象
 * @type {{}}
 */
var redisClients = {

};

/**
 * 获取redis客户端
 * @param name 配置标识
 * @returns {null|*} 客户端
 */
exeConnection.getRedisClient = function(name)
{
    var client = redisClients[name];
    if(!client)
    {
        console.log("初始化");
        var config = exeConnection.redisConfig[name];
        if(!config)
        {
            throw new Error("Code:"+code.redisClientInitError+" Msg:Redis配置中不存在key所对应值",code.redisClientInitError);
        }
        client = redis.createClient(config);
        redisClients[name] = client;
    }
    return client;
};






