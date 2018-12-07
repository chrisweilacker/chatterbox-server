var url = require('url');
var fs = require('fs');
var cors = require('cors');
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

/* Import node's http module: */
const express = require('express');
const app = express();
//var readMessages = require('./request-handler.js').getMessages;
// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = '127.0.0.1';

var readMessages = function() {
  var messagesString = '';
  var file = fs.createReadStream('messages', 'utf-8');
  file.on('data', (chunk) => {
    if (chunk !== undefined) {
      messagesString += chunk;
    }
  });
  file.on('end', () => {
    console.log(messagesString);
    messages = JSON.parse(messagesString);
  });
};


// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
readMessages();
app.use(express.static('client'));
app.use(cors());
app.get('/classes/message*', (request, response) =>{
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  response.type('application/json');
  // headers['Content-Type'] = 'application/json';
  // response.writeHead(statusCode, headers);
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  var filteredMessages = {results: messages.results.slice(0)};
  //check if url has roomname key
  // loop through if filteredmessages has roomname
  var q = url.parse(request.url, true);
  console.log('Request for' + filteredMessages.results);
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
    response.send(JSON.stringify(filteredMessages));
  } else {
    response.send(JSON.stringify(messages));
  }
});

app.options('/classes/message*', (request, response) =>{
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  response.type('application/json');
  // headers['Content-Type'] = 'application/json';
  // response(statusCode, headers);
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
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
    response.send(JSON.stringify(filteredMessages));
  } else {
    response.send(JSON.stringify(messages));
  }
});

app.post('/classes/message*', (request, response) => {

  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  //headers['Content-Type'] = 'application/json';
  response.type('application/json');
  //response.writeHead(statusCode, headers);
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
    fs.writeFile('messages', JSON.stringify(messages), 'utf-8', function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Succesfully Written Data to File : ", data);
      }
    });
    response.send(JSON.stringify(messages));
  });
// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.
});

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
app.listen(port);
console.log('Listening on http://' + ip + ':' + port);


