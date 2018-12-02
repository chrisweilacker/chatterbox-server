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
var path = require('path');
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
      //check if url has roomname key
      // loop through if filteredmessages has roomname
      var q = url.parse(request.url, true);
      if (q.query.data && JSON.parse(q.query.data).where) {
        var where = JSON.parse(q.query.data).where;
        console.log(where);
        for (var i = 0; i < filteredMessages.results.length; i++) {
          console.log("filteredMessages.results=", filteredMessages.results);
          if (where.room) {
            if (where.room !== filteredMessages.results[i].room) {
              filteredMessages.results.splice(i, 1);
              i--;
            }
          } else if (where.username) {
            if (where.username !== filteredMessages.results[i].username) {
              filteredMessages.results.splice(i, 1);
              i--;
            }
          }

        }
        response.end(JSON.stringify(filteredMessages));
      } else {
        response.end(JSON.stringify(messages));
      }


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

    var filePath = request.url;

    if (filePath === '/arglebargle') {
      //handle test 404 syncronously
      response.writeHead(404);
      response.end('Sorry');
    }

    if (filePath == '/' || filePath.includes('/?username=')) {
      filePath = '/index.html';
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile("./client" + filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
              response.writeHead(404);
              console.log("./client/rpt11-chatterbox-client" + filePath)
              response.end('Sorry, file not found.');
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+ error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

  }
};



exports.requestHandler = requestHandler;

