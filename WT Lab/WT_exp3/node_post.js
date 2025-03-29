var http = require('http');
var queryString = require('querystring');

http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        var postData = queryString.parse(body);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write("<h2>Successfully logged in.<h2>")
        res.write("<h2>Your name is " + postData['name'] + ", your email is " + postData['email'] +"</h2>");
        res.end();
    });
}).listen(7001, () => console.log("Server running at http://localhost:7001"));