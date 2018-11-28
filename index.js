/*
    Homework Assignment #1
*/

//Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config')
const fs = require('fs')

// Instantiate the HTTP server
var httpServer = http.createServer((req,resp) =>{
    unifiedServer(req,resp);
});

//Start the server and make it listening 
httpServer.listen(config.httpPort, () => {
    console.log("The server is listening on port " + config.httpsPort + " now "  + config.envName + " mode" );
});

//Some necessary features to initiate the https server
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
//Instantiate de HTTPS server /
var httpsServer = http.createServer(httpsServerOptions, (req,resp)=>{
    unifiedServer(req,resp);
});

//Start the server and make it listening 
httpsServer.listen(config.httpsPort, () => {
    console.log("The server is listening on port " + config.httpsPort + " now "  + config.envName + " mode" );
});


//All the server logic for both de http and https createServer
var unifiedServer = (req, resp) => {

    //parse the url
    var parsedUrl = url.parse(req.url, true);

    //get the path
    var path = parsedUrl.pathname;
    var trimedPath = path.replace(/^\/+|\/+$/g, '');

    //get the query string as a object
    var queryStringObject = parsedUrl.query;

    //get the http method
    var method = req.method.toLowerCase();

    //get the headers
    var headers = req.headers;

    //get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = "";
    req.on('data', data =>{
        buffer += decoder.write(data);
    });
    req.on('end', () =>{
        buffer += decoder.end();

        //chose the handler
        var chosenHandler = typeof(router[trimedPath]) !== 'undefined' ?  router[trimedPath] : handlers.notFound;

        //construct the data object to send to the handler
        var data = {
            'trimedPath':trimedPath,
            'queryStringObject':queryStringObject,
            'method':method,
            'headers':headers,
            'payload':buffer
        };

        //route the request to the especified handler
        chosenHandler(data, (statusCode, payload) =>{

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);

            resp.setHeader('Content-Type', 'application/json');
            resp.writeHead(statusCode);

            resp.end(payloadString);

            console.log('Returning this response :' , statusCode,payloadString);
        });       
    });
};




//define the handlers
var handlers = {};
handlers.hello = (data,callback) =>{
    //calback http status code, and a payload object
    callback(406, {'message' : 'Welcome to node js master class !'});

};
//define not found handler
handlers.notFound = (data, callback) =>{
    callback(404);
};


//define a request router
var router = {
    'hello':handlers.hello
};
