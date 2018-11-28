/* 
*
*Create a export configuration
*
*/
var environments = {};

//Staging (default) evironment
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
};
//Production evironment
environments.production = {
    'httpPort': 5000,
    'httpsPort':5001,
    'envName': 'production'
};

//Determine witch environment was passed as command-line agument 
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentToExport;