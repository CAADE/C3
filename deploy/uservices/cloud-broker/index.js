let socketIOClient = require('socket.io-client');
let sailsIOClient = require('sails.io.js');

// Instantiate the socket client (`io`)
// (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
let io = sailsIOClient(socketIOClient);

// Set some options:
// (you have to specify the host and port of the Sails backend when using this library from Node.js)
io.sails.url = 'http://localhost:1337';
// ...

// Send a GET request to `http://localhost:1337/hello`:
io.socket.get('/bouquet/register?name=cloudbroker', function serverResponded(body, JWR) {
  // body === JWR.body
  console.log('Sails responded with: ', body);
  console.log('with headers: ', JWR.headers);
  console.log('and with status code: ', JWR.statusCode);
  // ...
  // more stuff
  // ...

  // When you are finished with `io.socket`, or any other sockets you connect manually,
  // you should make sure and disconnect them, e.g.:

  // (note that there is no callback argument to the `.disconnect` method)
});

io.socket.on('provision', (obj) => {
  console.log('Provision:', obj.instance.name);
  let update = {consumption: {type: 'compute', value: 1}, state: 'Running'};
  io.socket.post('/instance/update?id=' + obj.instance.id, update, (obj,res) => {
    console.log('Completed!', obj, res);
  });
});

// There are two types of interactions with the microservice.
// 1. Fire and forget
// 2. Fire and then do something when the action is complete.
