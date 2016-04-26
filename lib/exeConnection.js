/**
 * Created by lizi on 16/4/26.
 * 命令执行连接对象,采用连接池
 */
var Mysql = require("mysql");
var Redis = require("redis");
var Code = require("./code");
var ExeConnection = module.exports;
/**
 * 池集群
 * @type {null}
 */
ExeConnection.poolCluster = null;

/**
 * 集群池配置
 * @type {null}
 */
ExeConnection.poolsConfig = null;

/**
 * 从池中获取连接
 * @param name 池名字
 * @param callback 回调
 */
ExeConnection.getConnection = function(name,callback)
{
    if(ExeConnection.poolCluster === null)
    {
        ExeConnection.poolCluster = Mysql.createPoolCluster();

        var Config = ExeConnection.poolsConfig ? ExeConnection.poolsConfig : require("./config");

        for(name in Config)
        {
            var name = name;
            var config = Config[name];
            ExeConnection.poolCluster.add(name, config);
        }
    }
    ExeConnection.poolCluster.getConnection(name,callback);
};


/**
 *  redis配置
 * @type {null}
 */
ExeConnection.redisConfig = {};

/**
 * REDIS 对象
 * @type {{}}
 */
var RedisClients = {

};

/**
 * 获取redis客户端
 * @param name 配置标识
 * @returns {null|*} 客户端
 */
ExeConnection.getRedisClient = function(name)
{
    var client = RedisClients[name];
    if(!client)
    {
        console.log("初始化");
        var config = ExeConnection.redisConfig[name];
        if(!config)
        {
            throw new Error("Code:"+Code.redisClientInitError+" Msg:Redis配置中不存在key所对应值",Code.redisClientInitError);
        }
        client = Redis.createClient(config);
        RedisClients[name] = client;
    }
    return client;
};






