/*
Creates a socket.io app that performs the features of communication between 
client and server like:
1. sending data to the client from the server through the socket connection :
    send a Hello World message and an update of number of clients connected
2. sending data to the server from the client through the socket connection :
    recieve text typed in by client
*/

var http = require('http'),
    fs = require('fs'),
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

//counter for connected clients
var numClients = 0;    

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
	//send client welcome message
    socket.emit('message', {'message': 'Hello World'});

    //increment number of clients logged in
    numClients++;
    io.emit('stats', { numClients: numClients });

    console.log('User connected, number of clients now: ', numClients);

    socket.on('disconnect', function() {
        numClients--;
        io.emit('stats', { numClients: numClients });

        console.log('User disconnected, number of clients now: ', numClients);
    });

    //send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);

    //recieve client data
    socket.on('client_data', function(data){
        process.stdout.write(data.letter);
    });
});

app.listen(3000, function(){
	console.log("App is runing on port Number 3000"); 
	console.log("Try this Url in Browser :- http://localhost:3000/");
});
