/**
 * Created by lizi on 16/4/26.
 */
var executor = require("./lib/executor");
var command = require("./lib/command");
module.exports.executor = executor;
module.exports.command = command;

/**
 * 设置池配置
 * @param config
 */
module.exports.setPoolConfig = function(config)
{
    executor.setPoolConfig(config);
};

/**
 * 设置REDIS配置
 * @param config
 */
module.exports.setRedisConfig = function(config)
{
    executor.setRedisConfig(config);
};
