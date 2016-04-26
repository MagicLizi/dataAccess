/**
 * Created by lizi on 16/4/26.
 * 命令执行连接对象,采用连接池
 */
var Mysql = require("mysql");

module.exports = exeConnection;

/**
 * 池集群
 * @type {null}
 */
exeConnection.prototype.poolCluster = null;

/**
 * 集群池配置
 * @type {null}
 */
exeConnection.prototype.poolsConfig = null;

/**
 * 从池中获取连接
 * @param name 池名字
 * @param callback 回调
 */
exeConnection.prototype.getConnection = function(name,callback)
{
    module.exports.poolCluster.getConnection(name,callback);
};


/**
 * 构造函数
 */
function exeConnection()
{
    if(exeConnection.poolCluster === undefined)
    {
        exeConnection.poolCluster = Mysql.createPoolCluster();

        var Config = exeConnection.poolsConfig ? exeConnection.poolsConfig : require("./config");

        for(name in Config)
        {
                var name = name;
                var config = Config[name];
                exeConnection.poolCluster.add(name, config);
        }
    }
}



