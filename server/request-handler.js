// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var url = require('url');
var fs = require('fs');
const querystring = require('querystring');
// 0:
// createdAt: "2018-12-01T20:51:05.169Z"
// objectId: "ZDHZMlp2N1"
// roomname: "bedroom"
// text: "what's up everybody?"
// updatedAt: "2018-12-01T20:51:05.169Z"
// username: "eric"
var messages = {results: [
  // {objectId: "bN6e9gLMjA", username: "eric", roomname: "DogRoom", text: "jumps", createdAt: "2018-12-01T20:50:19.476Z"},
  // {objectId: "cziCATEQSM", username: "Duncan", roomname: "DogRoom", text: "Kilroy was here.", createdAt: "2018-12-01T20:06:15.875Z"},
  // {objectId: "B8WnnGYNH0", username: "Duncan", roomname: "ROOMIII", text: "testDuncan", createdAt: "2018-12-01T20:06:02.485Z"}
]};
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.


  console.log('Serving request type ' + request.method + ' for url ' + request.url);


  if (request.url.includes('classes/messages')) {
    if (request.method === 'GET' || request.method === 'OPTIONS') {
      // The outgoing status.
      var statusCode = 200;

      // See the note below about CORS headers.
      var headers = defaultCorsHeaders;


      // Tell the client we are sending them plain text.
      //
      // You will need to change this if you are sending something
      // other than plain text, like JSON or HTML.
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.

      console.log();
      var filteredMessages = {results: messages.results.slice(0)};
      // if (options.where) {
      //   for (var i = 0; i < filteredMessages.results.length; i++) {
      //     if (options.where.room !== filteredMessages.results[i].room) {
      //       filteredMessages.results.splice(i, 1);
      //     }
      //   }
      // }
      response.end(JSON.stringify(messages));

    } else if (request.method === 'POST') {
      // The outgoing status.
      var statusCode = 201;

      // See the note below about CORS headers.
      var headers = defaultCorsHeaders;


      // Tell the client we are sending them plain text.
      //
      // You will need to change this if you are sending something
      // other than plain text, like JSON or HTML.
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.

      var data = '';
      request.on('data', (chunk)=>{
        data+=chunk;
      });
      request.on('end',()=>{
        var message = JSON.parse(data);
        if (!message.room) {
          message.room = "";
        }
        var d = new Date;
        message.createdAt = d.toString();
        messages.results.push(message);
        response.end(JSON.stringify(messages));
      });
    }
  } else {
    // The outgoing status.
    var statusCode = 404;

    // See the note below about CORS headers.
    var headers = defaultCorsHeaders;


    // Tell the client we are sending them plain text.
    //
    // You will need to change this if you are sending something
    // other than plain text, like JSON or HTML.
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.
    response.end('I Don\'t Understand You');
  }
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

};



exports.requestHandler = requestHandler;

